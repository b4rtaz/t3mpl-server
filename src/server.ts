import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cron from 'cron';
import express from 'express';
import handlebars from 'express-handlebars';
import i18n from 'i18n';
import path from 'path';
import winston from 'winston';

import { authMiddleware } from './auth/auth';
import { configurationMiddleware } from './configuration/configuration';
import { readConfiguration } from './configuration/file-configuration-reader';
import { WebsitesAdminController } from './controllers/admin/websites-admin-controller';
import { ReadWebsitesApiController } from './controllers/api/read-website-api-controller';
import { WriteWebsiteApiController } from './controllers/api/write-website-api-controller';
import { LoginAuthController } from './controllers/auth/login-auth-controller';
import { LogoutAuthController } from './controllers/auth/logout-auth-controller';
import { errorHandler } from './controllers/error-handler';
import { HomeController } from './controllers/home-controller';
import { cleanArtefactsJob } from './cron/clean-artefacts-job';
import { repositoriesMiddleware } from './repositories/repositories';

const config = readConfiguration('./configuration.json');

// logger

winston.configure({
	format: winston.format.combine(
		winston.format.errors({
			stack: true
		}),
		winston.format.timestamp()
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(config.log.dirPath, 'log.log')
		})
	]
});

try {
	const app = express();

	// i18n

	i18n.configure({
		locales: config.locales.locales,
		defaultLocale: config.locales.defaultLocale,
		directory: './locales',
		updateFiles: false
	});

	app.use(i18n.init);

	// handlebars

	app.set('views', './views');
	app.set('view engine', 'handlebars');
	app.engine('handlebars', handlebars({
		helpers: {
			__: function () {
				return i18n.__n.apply(this, arguments);
			}
		}
	}));

	// framework

	app.use(cookieSession({
		name: 't3mpl',
		maxAge: config.session.maxAge,
		keys: config.session.secretKeys
	}));
	// tslint:disable-next-line
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(configurationMiddleware(config));
	app.use(authMiddleware);
	app.use(repositoriesMiddleware);

	winston.configure({
		transports: [
			new winston.transports.Console({
				format: winston.format.simple()
			}),
			new winston.transports.File({
				filename: path.join(config.log.dirPath, 'log.log'),
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.prettyPrint()
				)
			})
		]
	});

	// routing

	app.use('/static', express.static('./static', {
		cacheControl: true
	}));
	app.use('/editor', express.static(config.editor.dirPath));

	app.get('/', HomeController.get);

	app.get('/login', LoginAuthController.get);
	app.post('/login', LoginAuthController.post);
	app.get('/logout/:token', LogoutAuthController.get);

	app.get('/websites', WebsitesAdminController.getWebsites);

	app.get('/websites/:name/:directory/*', ReadWebsitesApiController.getFile);
	app.post('/websites/:name', WriteWebsiteApiController.createArtefact);
	app.put('/websites/:name/:artefactId/data/*', WriteWebsiteApiController.putArtefactDataFile);
	app.post('/websites/:name/:artefactId', WriteWebsiteApiController.commitArtefact);

	app.use(errorHandler);

	// listen

	app.listen(config.server.port, () => {
		winston.info(`Server started at http://localhost:${config.server.port}.`);
	});

	// cron

	new cron.CronJob('*/1 * * * * *', cleanArtefactsJob(config)).start();
} catch (e) {
	winston.error(e);
}

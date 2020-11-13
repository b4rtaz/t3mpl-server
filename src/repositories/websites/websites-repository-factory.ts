import { ConfigurationRequest } from '../../configuration/configuration';
import { ConfigurationWebsitesRepository } from './configuration-websites-repository';
import { WebsitesRepository } from './websites-repository';

export class WebsitesRepositoryFactory {

	public static create(request: ConfigurationRequest): WebsitesRepository {
		const driver = request.configuration.database.driver;
		switch (request.configuration.database.driver) {
			case 'configuration':
				return new ConfigurationWebsitesRepository(request);
			default:
				throw new Error(`Not supported database driver ${driver}.`);
		}
	}
}

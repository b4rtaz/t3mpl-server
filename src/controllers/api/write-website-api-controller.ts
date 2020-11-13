import { Response } from 'express';

import { Artefact, ArtefactFactory } from '../../core/artefacts/artefact';
import { validFilePathFromRequest } from '../../core/artefacts/file-path-validator';
import { Website } from '../../repositories/websites/websites-repository';
import { NotFoundError } from '../not-found-error';
import { Request } from '../request';

export class WriteWebsiteApiController {

	public static createArtefact(request: Request, response: Response) {
		request.auth.mustBeAuthorized();

		const website = loadWebsite(request);
		const artefact = createArtefact(request);
		artefact.begin(request.auth.getUserName(), website.name);

		response.json({
			dataDir: `/${artefact.id}/data/`,
			commit: `/${artefact.id}`
		} as CreateArtefactResponse);
	}

	public static putArtefactDataFile(request: Request, response: Response, next: () => void) {
		request.auth.mustBeAuthorized();

		const website = loadWebsite(request);
		const artefactId = request.params['artefactId'];
		const artefact = createArtefact(request);
		artefact.load(request.auth.getUserName(), website.name, artefactId);

		const filePath = request.params['0'];
		validFilePathFromRequest(filePath);

		request.pipe(artefact.createDataWriteStream(filePath));
		request.on('end', () => {
			response.json({
				success: true
			} as PutArtefactFileResponse);
			next();
		});
	}

	public static commitArtefact(request: Request, response: Response) {
		request.auth.mustBeAuthorized();

		const website = loadWebsite(request);
		const artefactId = request.params['artefactId'];
		const artefact = createArtefact(request);
		artefact.load(request.auth.getUserName(), website.name, artefactId);

		artefact.build(
			website.templateDirPath
		);
		artefact.publish(
			website.dataDirPath,
			website.releaseDirPath
		);
		artefact.clean();

		response.json({
			success: true
		} as CommitArtefactResponse);
	}
}

function loadWebsite(request: Request): Website {
	const websiteName = request.params['name'];
	const website = request.repositories.websites.tryGetWebsite(request.auth.getUserName(), websiteName);
	if (!website) {
		throw new NotFoundError('Cannot find a website.');
	}
	return website;
}

function createArtefact(request: Request): Artefact {
	return ArtefactFactory.create(
		request.configuration.generator.tempDirPatch);
}

interface CreateArtefactResponse {
	templateDir: string;
	dataDir: string;
	commit: string;
}

interface PutArtefactFileResponse {
	success: boolean;
}

interface CommitArtefactResponse {
	success: boolean;
}

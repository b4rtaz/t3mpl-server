import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getFileExt } from 't3mpl-core/core/utils/path-utils';

import { validFilePathFromRequest } from '../../core/artefacts/file-path-validator';
import { getMimeType } from '../../core/ext-to-mime-type';
import { Website } from '../../repositories/websites/websites-repository';
import { NotFoundError } from '../not-found-error';
import { Request } from '../request';

export class ReadWebsitesApiController {

	public static getFile(request: Request, response: Response) {
		request.auth.mustBeAuthorized();

		const websiteName = request.params['name'];
		const website = request.repositories.websites.tryGetWebsite(request.auth.getUserName(), websiteName);
		if (!website) {
			throw new NotFoundError(`Cannot find website named ${websiteName}.`);
		}

		const directory = request.params['directory'];
		const filePath = request.params['0'];
		validFilePathFromRequest(filePath);

		const basePath = readBasePathByDirectory(directory, website);
		const finalPath = path.join(path.join('./'), basePath, filePath);
		if (!fs.existsSync(finalPath)) {
			throw new NotFoundError(`File not found: ${directory}/${filePath}.`);
		}
		if (fs.lstatSync(finalPath).isDirectory()) {
			throw new NotFoundError(`This path is for the directory: ${directory}/${filePath}.`);
		}

		const filePathExt = getFileExt(filePath);
		const mimeType = getMimeType(filePathExt);

		const stream = fs.createReadStream(finalPath);
		stream.on('open', () => {
			response.type(mimeType);
			stream.pipe(response);
		});
	}
}

function readBasePathByDirectory(directory: string, website: Website): string {
	switch (directory) {
		case 'data':
			return website.dataDirPath;
		case 'template':
			return website.templateDirPath;
		default:
			throw new Error('Not supported directory.');
	}
}

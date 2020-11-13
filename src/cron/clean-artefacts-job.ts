import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import winston from 'winston';

import { Configuration, GeneratorConfiguration } from '../configuration/configuration';
import { readArtefactInfo } from '../core/artefacts/artefact-info-reader';

export function cleanArtefactsJob(config: Configuration) {
	return () => {
		try {
			const now = Date.now();
			const cleaned = ArtefactCleaner.clean(now, config.generator);
			if (cleaned > 0) {
				winston.info(`Cleaned up ${cleaned} artefacts`);
			}
		} catch (e) {
			winston.error(e);
		}
	};
}

export class ArtefactCleaner {

	public static clean(now: number, config: GeneratorConfiguration): number {
		const oldDirPaths = [];

		const aretefactDirPaths = getArtefactDirPaths(config.tempDirPatch);

		for (const dirPath of aretefactDirPaths) {
			const infoPath = path.join(dirPath, 'artefact.json');
			if (!fs.existsSync(infoPath)) {
				oldDirPaths.push(dirPath);
				continue;
			}

			const info = readArtefactInfo(infoPath);
			if (info.createdAt + config.maxArtefactLifetime < now) {
				oldDirPaths.push(dirPath);
				continue;
			}
		}

		for (const dirPath of oldDirPaths) {
			fsExtra.removeSync(dirPath);
		}
		return oldDirPaths.length;
	}
}

function getArtefactDirPaths(tempDirPatch: string): string[] {
	return fs.readdirSync(tempDirPatch)
		.map(p => path.join(tempDirPatch, p))
		.filter(p => fs.statSync(p).isDirectory());
}

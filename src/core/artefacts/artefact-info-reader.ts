import fs from 'fs';

import { ArtefactInfo } from './artefact-info';

export function readArtefactInfo(path: string): ArtefactInfo {
	const infoRaw = fs.readFileSync(path, 'utf-8');
	return JSON.parse(infoRaw) as ArtefactInfo;
}

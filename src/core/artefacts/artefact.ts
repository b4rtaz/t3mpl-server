import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { ArtefactBuilder } from './artefact-builder';
import { ArtefactInfo } from './artefact-info';
import { readArtefactInfo } from './artefact-info-reader';

export class Artefact {

	public id: string;
	public info: ArtefactInfo;

	public artefactDirPath: string;
	public infoPath: string;
	public dataDirPath: string;
	public buildDirPath: string;

	public constructor(
		private readonly tempPatch: string) {
	}

	private setPaths(id: string) {
		this.artefactDirPath = path.join(this.tempPatch, id);
		this.infoPath = path.join(this.artefactDirPath, 'artefact.json');
		this.dataDirPath = path.join(this.artefactDirPath, 'data');
		this.buildDirPath = path.join(this.artefactDirPath, 'build');
	}

	public begin(owner: string, websiteName: string) {
		this.id = uuidv4();
		this.info = {
			owner,
			websiteName,
			createdAt: Date.now()
		};
		this.setPaths(this.id);

		fs.mkdirSync(this.artefactDirPath);
		const infoJson = JSON.stringify(this.info);
		fs.writeFileSync(this.infoPath, infoJson);
		fs.mkdirSync(this.dataDirPath);
		fs.mkdirSync(this.buildDirPath);
	}

	public load(owner: string, websiteName: string, id: string) {
		this.id = id;
		this.setPaths(this.id);

		this.info = readArtefactInfo(this.infoPath);
		if (this.info.owner !== owner || this.info.websiteName !== websiteName) {
			throw new Error('Cannot modifiy this artefact.');
		}
	}

	public createDataWriteStream(filePath: string): fs.WriteStream {
		this.reaquireLoaded();

		const finalPath = path.join(this.dataDirPath, filePath);
		fs.mkdirSync(path.dirname(finalPath), {
			recursive: true
		});
		return fs.createWriteStream(finalPath);
	}

	public build(templateDirPath: string) {
		this.reaquireLoaded();
		ArtefactBuilder.build(templateDirPath, this.dataDirPath, this.buildDirPath);
	}

	public publish(dataDirPath: string, releaseDirPath: string) {
		this.reaquireLoaded();

		fsExtra.copySync(this.dataDirPath, dataDirPath);
		fsExtra.copySync(this.buildDirPath, releaseDirPath);
	}

	public clean() {
		this.reaquireLoaded();
		fsExtra.removeSync(this.artefactDirPath);
		this.id = null;
	}

	private reaquireLoaded() {
		if (!this.id) {
			throw new Error('This artefact is not loaded.');
		}
	}
}

export class ArtefactFactory {

	public static create(tempPath: string): Artefact {
		return new Artefact(tempPath);
	}
}

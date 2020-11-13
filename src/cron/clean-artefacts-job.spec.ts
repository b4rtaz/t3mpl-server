import fsExtra from 'fs-extra';
import mockFs from 'mock-fs';
import winston from 'winston';

import { Configuration, GeneratorConfiguration } from '../configuration/configuration';
import { ArtefactCleaner, cleanArtefactsJob } from './clean-artefacts-job';

describe('cleanArtefactsJob', () => {

	let func: Function;

	beforeEach(() => {
		const config = { generator: {} } as Configuration;
		func = cleanArtefactsJob(config);
	});

	it('when cleaner returns more than 0 then logger is called', () => {
		const cleanerSpy = spyOn(ArtefactCleaner, 'clean').and.returnValue(1);
		const infoSpy = spyOn(winston, 'info');

		func();

		expect(cleanerSpy).toHaveBeenCalled();
		expect(infoSpy).toHaveBeenCalled();
	});

	it('when cleaner throws error then logger is called', () => {
		const cleanerSpy = spyOn(ArtefactCleaner, 'clean').and.throwError(new Error('E0'));
		const errorSpy = spyOn(winston, 'error');

		func();

		expect(cleanerSpy).toHaveBeenCalled();
		expect(errorSpy).toHaveBeenCalled();
	});
});

describe('ArtefactCleaner', () => {

	it('clean() cleans as expected', () => {
		const config: GeneratorConfiguration = {
			tempDirPatch: './temp',
			maxArtefactLifetime: 100
		};

		const now = 1000;
		const deletedDirPaths: string[] = [];
		const removeSyncSpy = spyOn(fsExtra, 'removeSync').and.callFake((dirPath) => {
			deletedDirPaths.push(dirPath.replace(/\\/, '/')); // windows to unix path replacement
		});

		mockFs({
			'temp/unique1/artefact.json': '{ "owner": "admin", "websiteName": "X", "createdAt": 900 }',
			'temp/unique2/artefact.json': '{ "owner": "admin", "websiteName": "X", "createdAt": 910 }',
			'temp/unique3/artefact.json': '{ "owner": "admin", "websiteName": "X", "createdAt": 899 }',
			'temp/unique4/junk.json': '{}'
		});

		const deleted = ArtefactCleaner.clean(now, config);

		expect(deleted).toEqual(2);
		expect(removeSyncSpy).toHaveBeenCalledTimes(2);
		expect(deletedDirPaths).toContain('temp/unique3');
		expect(deletedDirPaths).toContain('temp/unique4');

		mockFs.restore();
	});
});

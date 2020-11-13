import fs from 'fs';
import fsExtra from 'fs-extra';
import mockFs from 'mock-fs';
import path from 'path';

import { Artefact, ArtefactFactory } from './artefact';
import { ArtefactBuilder } from './artefact-builder';

describe('Artefact', () => {

	it('begin() creates artefact', () => {
		const mkdirSpy = spyOn(fs, 'mkdirSync');
		const writeFileSpy = spyOn(fs, 'writeFileSync');

		const artefact = ArtefactFactory.create('./temp');
		artefact.begin('root', 'blog');

		expect(artefact.dataDirPath.startsWith(artefact.artefactDirPath)).toBeTrue();
		expect(artefact.buildDirPath.startsWith(artefact.artefactDirPath)).toBeTrue();

		expect(/temp[\\/]\S+/.test(artefact.artefactDirPath)).toBeTrue();
		expect(/temp[\\/]\S+[\\/]data/.test(artefact.dataDirPath)).toBeTrue();
		expect(/temp[\\/]\S+[\\/]build/.test(artefact.buildDirPath)).toBeTrue();

		expect(mkdirSpy).toHaveBeenCalledTimes(3);
		expect(writeFileSpy).toHaveBeenCalledTimes(1);
	});

	it('manipulate methods throws error when artefact is not loaded', () => {
		const e = (err: Error) => err.message.startsWith('This artefact is not loaded');

		const artefact = ArtefactFactory.create('./temp');
		expect(() => artefact.build('./dist')).toThrowMatching(e);
		expect(() => artefact.clean()).toThrowMatching(e);
		expect(() => artefact.publish('./data', './dist')).toThrowMatching(e);
		expect(() => artefact.createDataWriteStream('template.yaml')).toThrowMatching(e);
	});

	it('load() when arguments are correct then loads artefact', () => {
		mockFs(getDirMock());

		const artefact = ArtefactFactory.create('./temp');
		artefact.load('admin', 'blog', 'unique1');

		expect(/temp[\\/]unique1/.test(artefact.artefactDirPath)).toBeTrue();
		expect(artefact.info.websiteName).toEqual('blog');
		expect(artefact.info.createdAt).toEqual(1000);

		mockFs.restore();
	});

	it('load() when arguments are invalid then throws error', () => {
		const e = (err: Error) => err.message.startsWith('Cannot modifiy this artefact');

		mockFs(getDirMock());

		const artefact = ArtefactFactory.create('./temp');

		expect(() => artefact.load('SOME_USER', 'blog', 'unique1')).toThrowMatching(e);
		expect(() => artefact.load('admin', 'SOME_WEBSITE_NAME', 'unique1')).toThrowMatching(e);

		mockFs.restore();
	});

	it('createDataWriteStream() returns write stream', () => {
		mockFs(getDirMock());

		const expectedStream = {} as fs.WriteStream;

		const mkdirSpy = spyOn(fs, 'mkdirSync').and.callFake((p, opts) => {
			expect(p).toEqual(`temp${path.sep}unique1${path.sep}data${path.sep}assets`);
			expect(opts.recursive).toBeTrue();
			return p;
		});
		const createWsSpy = spyOn(fs, 'createWriteStream')
			.withArgs(`temp${path.sep}unique1${path.sep}data${path.sep}assets${path.sep}image.jpg`)
			.and.returnValue(expectedStream);

		const artefact = getArtefactMock();
		const stream = artefact.createDataWriteStream('assets/image.jpg');

		expect(mkdirSpy).toHaveBeenCalledTimes(1);
		expect(createWsSpy).toHaveBeenCalledTimes(1);
		expect(stream).toEqual(expectedStream);
	});

	it('build() calls ArtefactBuilder', () => {
		mockFs(getDirMock());

		const buildSpy = spyOn(ArtefactBuilder, 'build');

		const artefact = getArtefactMock();
		artefact.build('./template');

		expect(buildSpy).toHaveBeenCalledTimes(1);
		mockFs.restore();
	});

	it('publish() copies directories', () => {
		mockFs(getDirMock());

		let dataCopyCalled = false;
		let buildCopyCalled = false;

		const copySpy = spyOn(fsExtra, 'copySync')
			.withArgs(`temp${path.sep}unique1${path.sep}data`, './data').and.callFake(() => dataCopyCalled = true)
			.withArgs(`temp${path.sep}unique1${path.sep}build`, './release').and.callFake(() => buildCopyCalled = true);

		const artefact = getArtefactMock();
		artefact.publish('./data', './release');

		expect(copySpy).toHaveBeenCalledTimes(2);
		expect(dataCopyCalled).toBeTrue();
		expect(buildCopyCalled).toBeTrue();
		mockFs.restore();
	});

	it('clean() removes directory', () => {
		mockFs(getDirMock());

		const removeSpy = spyOn(fsExtra, 'removeSync').and.callFake(p => {
			expect(`temp${path.sep}unique1`).toEqual(p);
		});

		const artefact = getArtefactMock();
		artefact.clean();

		expect(removeSpy).toHaveBeenCalledTimes(1);
		mockFs.restore();
	});

	function getDirMock() {
		return {
			'temp/unique1/artefact.json': '{ "owner": "admin", "websiteName": "blog", "createdAt": 1000 }'
		};
	}

	function getArtefactMock(): Artefact {
		const artefact = new Artefact('./temp');
		artefact.load('admin', 'blog', 'unique1');
		return artefact;
	}
});

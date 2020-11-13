import { ArtefactBuilder, StorageReader } from './artefact-builder';
import mockFs from 'mock-fs';

// TODO

describe('ArtefactBuilder', () => {

	it('build() method exists', () => {
		expect(ArtefactBuilder.build).toBeDefined();
	});
});

describe('StorageReader', () => {

	it('readFiles() reads files', () => {
		mockFs({
			'foo/data.json': 'data.json',
			'foo/image.jpg': '<binary>'
		});

		const storage = StorageReader.readFiles('./foo', [
			'data.json',
			'image.jpg'
		]);

		expect(storage.getEntry('text', 'data.json')).toBeDefined();
		expect(storage.getEntry('binary', 'image.jpg')).toBeDefined();

		mockFs.restore();
	});
});

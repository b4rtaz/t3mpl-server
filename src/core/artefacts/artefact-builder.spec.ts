import fs from 'fs';
import mockFs from 'mock-fs';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';

import { ArtefactBuilder, StorageReader, StorageWriter } from './artefact-builder';

describe('ArtefactBuilder', () => {

	it('build() method exists', () => {
		spyOn(StorageReader, 'readFiles').and.callFake((dirPath, paths) => {
			const storage = new MemoryStorage();
			if (dirPath === 'template') {
				storage.setContent('text', 'index.html', '<p>{{ROOT.Y.Z}}</p>');
			}
			return storage;
		});
		spyOn(StorageWriter, 'writeFile');

		mockFs({
			'template/template.yaml':
`meta:
  version: 123
  name: Example
  license: MIT
  author: b4rtaz
  homepageUrl: http://foo.com/
  donationUrl: http://donate.com/
  filePaths:
    - index.html

dataContract:
  ROOT:
    sections:
      Y:
        properties:
          Z:
            type: (text)
            defaultValue: Foo

pages:
  INDEX:
    filePath: index.html
    templateFilePath: index.html
`,

			'data/data.json':
`{
    "meta": {
        "name": "Boilerplate",
        "version": 1,
        "filePaths": [
            "data.json"
        ]
    },
    "data": { "ROOT": { "Y": {  "Z": 100 } } }
}
`,

		});

		ArtefactBuilder.build('template', 'data', 'build');

		mockFs.restore();
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

describe('StorageWriter', () => {

	let mkdirSpy: jasmine.Spy;
	let mkdirCalled: boolean;
	let writeFileSpy: jasmine.Spy;
	let writeFileCalled: boolean;

	function before(dirPath: RegExp, filePath: RegExp, buffer: number[]) {
		mkdirCalled = false;
		mkdirSpy = spyOn(fs, 'mkdirSync').and.callFake((path) => {
			expect(dirPath.test(path)).toBeTrue();
			mkdirCalled = true;
			return path;
		});
		writeFileCalled = false;
		writeFileSpy = spyOn(fs, 'writeFileSync').and.callFake((path, data: Buffer) => {
			expect(filePath.test(path as string)).toBeTrue();
			expect(data.compare(Buffer.from(buffer))).toEqual(0);
			writeFileCalled = true;
		});
	}

	it('writeFile() writes binary file correctly', () => {
		before(/^temp$/, /^temp[\\\/]image.jpg$/, [0x71, 0x77, 0x65]);

		StorageWriter.writeFile('temp', 'image.jpg', 'qwe', 'binary');

		expect(mkdirCalled).toBeTrue();
		expect(writeFileCalled).toBeTrue();
	});

	it('writeFile() text binary file correctly', () => {
		before(/^\.$/, /^article.md$/, [0x3c, 0x70, 0x3e]);

		StorageWriter.writeFile('', 'article.md', '<p>', 'text');

		expect(mkdirCalled).toBeTrue();
		expect(writeFileCalled).toBeTrue();
	});
});

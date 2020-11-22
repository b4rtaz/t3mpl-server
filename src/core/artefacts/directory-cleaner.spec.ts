import fsExtra from 'fs-extra';
import mockFs from 'mock-fs';

import { DirectoryCleaner } from './directory-cleaner';

describe('DirectoryCleaner', () => {

	it('clean() clean directory', () => {
		mockFs({
			'build/data.json': '{}',
			'build/.gitignore': '*',
			'build/assets/image.jpg': '%',
			'build/content/markdown/content.md': '#',
		});
		const paths: string[] = [];
		spyOn(fsExtra, 'removeSync').and.callFake((path) => {
			paths.push(path.replace(/\\/g, '/'));
		});

		DirectoryCleaner.clean('build', ['content', '.gitignore']);

		expect(paths).toContain('build/assets');
		expect(paths).toContain('build/data.json');
		expect(paths).not.toContain('build/.gitignore');
		expect(paths).not.toContain('build/content');

		mockFs.restore();
	});
});

import mockFs from 'mock-fs';

import { readArtefactInfo } from './artefact-info-reader';

describe('readArtefactInfo', () => {

	it('readArtefactInfo() reads json correctly', () => {
		mockFs({
			'artefact.json':
			`{
				"owner": "admin",
				"websiteName": "blog",
				"createdAt": 1604873532110
			}`
		});

		const config = readArtefactInfo('artefact.json');

		expect(config.owner).toEqual('admin');
		expect(config.websiteName).toEqual('blog');
		expect(config.createdAt).toEqual(1604873532110);

		mockFs.restore();
	});
});

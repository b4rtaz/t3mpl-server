import mockFs from 'mock-fs';

import { readConfiguration } from './file-configuration-reader';

describe('readConfiguration', () => {

	it('readConfiguration() reads config json correctly', () => {
		mockFs({
			'config.json': `
			{
				"server": {
					"port": 5678
				}
			}
			`
		});

		const config = readConfiguration('config.json');

		expect(config).toBeDefined();
		expect(config.server.port).toEqual(5678);

		mockFs.restore();
	});
});

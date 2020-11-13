import fs from 'fs';
import mockFs from 'mock-fs';

import { mockAuthRequest } from '../../auth/auth-request-mock';
import { mockResponse } from '../../core/request-mock';
import { Repositories } from '../../repositories/repositories';
import { WebsitesRepository } from '../../repositories/websites/websites-repository';
import { Request } from '../request';
import { ReadWebsitesApiController } from './read-website-api-controller';

describe('ReadWebsitesApiController', () => {

	it('getFile() when site does not exist then throws error', () => {
		const m = mock('NOT_EXISTS_WEBSITE', 'data', 'assets/data.json');

		expect(() => ReadWebsitesApiController.getFile(m.request, m.response))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find website'));
	});

	it('getFile() when passed invalid path the throws error', () => {
		const m = mock('my-blog', 'data', 'assets/unknow-file.jpg');

		expect(() => ReadWebsitesApiController.getFile(m.request, m.response))
			.toThrowMatching((e: Error) => e.message.startsWith('File not found'));
	});

	it('getFile() when passed invalid directory the throws error', () => {
		const m = mock('my-blog', 'INVALID_DIRECTORY', 'data.json');

		expect(() => ReadWebsitesApiController.getFile(m.request, m.response))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported directory'));
	});

	it('getFile() when passed directory path the throws error', () => {
		const m = mock('my-blog', 'data', 'assets');

		expect(() => ReadWebsitesApiController.getFile(m.request, m.response))
			.toThrowMatching((e: Error) => e.message.startsWith('This path is for the directory'));
	});

	it('getFile() returns data file correctly', () => {
		const m = mock('my-blog', 'data', 'assets/data.json');

		ReadWebsitesApiController.getFile(m.request, m.response);

		expect(m.response.mock.type).toEqual('application/json');
		expect(m.called.on).toBeTrue();
		expect(m.called.pipe).toBeTrue();
	});

	it('getFile() returns template file correctly', () => {
		const m = mock('my-blog', 'template', 'assets/template.yaml');

		ReadWebsitesApiController.getFile(m.request, m.response);

		expect(m.response.mock.type).toEqual('text/yaml');
		expect(m.called.on).toBeTrue();
		expect(m.called.pipe).toBeTrue();
	});

	afterEach(() => {
		mockFs.restore();
	});

	function mock(websiteName: string, directory: string, filePath: string) {
		const request = mockAuthRequest<Request>({
			params: {
				'name': websiteName,
				'directory': directory,
				'0': filePath
			}
		}, 'john');
		const response = mockResponse({});
		const called = {
			on: false,
			pipe: false
		};

		request.repositories = {
			websites: {
				tryGetWebsite: (owner: string, name: string) => {
					if (owner === 'john' && name === 'my-blog') {
						return {
							name: 'my-blog',
							owner: 'john',
							dataDirPath: './data',
							templateDirPath: './template'
						};
					}
					return null;
				}
			} as WebsitesRepository
		} as Repositories;

		mockFs({
			'data/assets/data.json': 'data.json',
			'template/assets/template.yaml': 'template.yaml'
		});

		spyOn(fs, 'createReadStream').and.callFake((f) => {
			const rs = {
				on: (eventName: string, func: Function) => {
					expect(eventName).toEqual('open');
					called.on = true;
					func();
					return rs;
				},
				pipe: (stream: any) => {
					expect(stream).toEqual(response);
					called.pipe = true;
					return rs;
				}
			} as fs.ReadStream;
			return rs;
		});
		return { request, response, called };
	}
});

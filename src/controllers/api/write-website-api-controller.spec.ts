import fs from 'fs';

import { mockAuthRequest } from '../../auth/auth-request-mock';
import { Configuration } from '../../configuration/configuration';
import { Artefact, ArtefactFactory } from '../../core/artefacts/artefact';
import { mockNext, mockResponse } from '../../core/request-mock';
import { Repositories } from '../../repositories/repositories';
import { WebsitesRepository } from '../../repositories/websites/websites-repository';
import { Request } from '../request';
import { WriteWebsiteApiController } from './write-website-api-controller';

describe('WriteWebsiteApiController', () => {

	it('createArtefact() creates artefact', () => {
		const request = mockRequest({});
		const response = mockResponse({});

		const artefact = {
			id: undefined,
			begin: (userName: string, websiteName: string) => {
				expect(userName).toEqual('john');
				expect(websiteName).toEqual('my-blog');
				artefact.id = 'unique1';
			}
		} as Artefact;

		spyOn(ArtefactFactory, 'create').and.returnValue(artefact);

		WriteWebsiteApiController.createArtefact(request, response);

		expect(artefact.id).toEqual('unique1');
		expect(response.mock.body.dataDir).toEqual('/unique1/data/');
		expect(response.mock.body.commit).toEqual('/unique1');
	});

	it('createArtefact() throws error when site does not exist', () => {
		const request = mockRequest({
			'name': 'UNKNOWN_WEBSITE'
		});
		const response = mockResponse({});

		expect(() => WriteWebsiteApiController.createArtefact(request, response))
			.toThrowMatching((e: Error) => e.message.startsWith('Cannot find a website'));
	});

	it('putArtefactDataFile() puts file', () => {
		const called = {
			load: false,
			createWriteStream: false,
			on: false,
			pipe: false
		};
		const ws = {} as fs.WriteStream;
		const response = mockResponse({});
		const request = mockRequest({
			'artefactId': 'unique900',
			'0': 'data.json'
		});
		request.on = (eventName: string, func: Function) => {
			expect(eventName).toEqual('end');
			called.on = true;
			func();
			return request;
		};
		request.pipe = (stream: any, opts: any) => {
			expect(stream).toEqual(ws);
			called.pipe = true;
			return stream;
		};
		const next = mockNext();

		const artefact = {
			load: (userName: string, websiteName: string, artefactId: string) => {
				expect(userName).toEqual('john');
				expect(websiteName).toEqual('my-blog');
				expect(artefactId).toEqual('unique900');
				artefact.id = artefactId;
				called.load = true;
			},
			createDataWriteStream: (filePath: string) => {
				expect(filePath).toEqual('data.json');
				called.createWriteStream = true;
				return ws;
			}
		} as Artefact;
		spyOn(ArtefactFactory, 'create').and.returnValue(artefact);

		WriteWebsiteApiController.putArtefactDataFile(request, response, next.mock);

		expect(called.load).toBeTrue();
		expect(called.createWriteStream).toBeTrue();
		expect(called.on).toBeTrue();
		expect(called.pipe).toBeTrue();
		expect(response.mock.body.success).toBeTrue();
		expect(next.called()).toBeTrue();
	});

	it('commitArtefact() builds, publish and cleans artefact', () => {
		const request = mockRequest({
			'artefactId': 'unique900'
		});
		const response = mockResponse({});
		const called = {
			load: false,
			build: false,
			publish: false,
			clean: false
		};
		const artefact = {
			id: undefined,
			load: (userName: string, websiteName: string, artefactId: string) => {
				expect(userName).toEqual('john');
				expect(websiteName).toEqual('my-blog');
				expect(artefactId).toEqual('unique900');
				artefact.id = artefactId;
				called.load = true;
			},
			build: (templateDirPath: string) => {
				expect(templateDirPath).toEqual('./template');
				called.build = true;
			},
			publish: (dataDirPath: string, releaseDirPath: string) => {
				expect(dataDirPath).toEqual('./data');
				expect(releaseDirPath).toEqual('./release');
				called.publish = true;
			},
			clean: () => {
				called.clean = true;
			}
		} as Artefact;
		spyOn(ArtefactFactory, 'create').and.returnValue(artefact);

		WriteWebsiteApiController.commitArtefact(request, response);

		expect(called.load).toBeTrue();
		expect(called.build).toBeTrue();
		expect(called.publish).toBeTrue();
		expect(called.clean).toBeTrue();
		expect(artefact.id).toEqual('unique900');
		expect(response.mock.body.success).toBeTrue();
	});

	function mockRequest(params: {}): Request {
		const request = mockAuthRequest<Request>({
			params: Object.assign({
				'name': 'my-blog'
			}, params)
		}, 'john');
		request.repositories = mockRepositories();
		request.configuration = mockConfiguration();
		return request;
	}

	function mockRepositories() {
		return {
			websites: {
				tryGetWebsite: (owner: string, name: string) => {
					if (owner === 'john' && name === 'my-blog') {
						return {
							name: 'my-blog',
							owner: 'john',
							dataDirPath: './data',
							templateDirPath: './template',
							releaseDirPath: './release'
						};
					}
					return null;
				}
			} as WebsitesRepository
		} as Repositories;
	}

	function mockConfiguration(): Configuration {
		return {
			generator: {
				tempDirPatch: './temp'
			}
		} as Configuration;
	}
});

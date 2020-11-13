import { mockAuthRequest } from '../../auth/auth-request-mock';
import { mockResponse } from '../../core/request-mock';
import { Repositories } from '../../repositories/repositories';
import { WebsitesRepository } from '../../repositories/websites/websites-repository';
import { Request } from '../request';
import { WebsitesAdminController, WebsitesViewModel } from './websites-admin-controller';

describe('WebsitesAdminController', () => {

	it('getWebsites() return websites view which website collection contains all user websites', () => {
		const userRequestMock = mockAuthRequest<Request>({}, 'john');
		userRequestMock.repositories = mockRepositories();
		const responseMock = mockResponse({});

		WebsitesAdminController.getWebsites(userRequestMock, responseMock);

		const vm = responseMock.mock.body as WebsitesViewModel;
		expect(responseMock.mock.viewName).toEqual('websites');
		expect(vm.websites.length).toEqual(1);
		const website = vm.websites.find(w => w.name === 't3mpl-one');
		expect(website).toBeDefined();
		expect(website.editUrl).toBeDefined();
	});

	function mockRepositories(): Repositories {
		return {
			websites: {
				getWebsites: (owner: string) => {
					if (owner === 'john') {
						return [
							{ name: 't3mpl-one', owner: 'john' }
						];
					}
					return [];
				}
			} as WebsitesRepository
		} as Repositories;
	}
});

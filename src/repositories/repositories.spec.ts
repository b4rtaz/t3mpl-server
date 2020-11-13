import { mockNext, mockReqest, mockResponse } from '../core/request-mock';
import { Repositories, repositoriesMiddleware, RepositoriesRequest } from './repositories';
import { UsersRepository } from './users/users-repository';
import { UsersRepositoryFactory } from './users/users-repository-factory';
import { WebsitesRepository } from './websites/websites-repository';
import { WebsitesRepositoryFactory } from './websites/websites-repository-factory';

describe('Repositories', () => {

	it('users() returns always same instance from factory', () => {
		const instance = {} as UsersRepository;
		spyOn(UsersRepositoryFactory, 'create').and.returnValue(instance);

		const request = mockReqest<RepositoriesRequest>({});
		const repos = new Repositories(request);

		expect(repos.users).toEqual(instance);
		expect(repos.users).toEqual(instance);
	});

	it('websites() returns always same instance from factory', () => {
		const instance = {} as WebsitesRepository;
		spyOn(WebsitesRepositoryFactory, 'create').and.returnValue(instance);

		const request = mockReqest<RepositoriesRequest>({});
		const repos = new Repositories(request);

		expect(repos.websites).toEqual(instance);
		expect(repos.websites).toEqual(instance);
	});
});

describe('repositories middleware', () => {

	it('repositoriesMiddleware() injects auth to request', () => {
		const request = mockReqest<RepositoriesRequest>({});
		const response = mockResponse({});
		const next = mockNext();

		repositoriesMiddleware(request, response, next.mock);

		expect(next.called);
		expect(request.repositories).toBeDefined();
		expect(request.repositories instanceof Repositories).toBeTrue();
	});
});

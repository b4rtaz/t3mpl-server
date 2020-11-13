import { Response } from 'express';

import { ConfigurationRequest } from '../configuration/configuration';
import { UsersRepository } from './users/users-repository';
import { UsersRepositoryFactory } from './users/users-repository-factory';
import { WebsitesRepository } from './websites/websites-repository';
import { WebsitesRepositoryFactory } from './websites/websites-repository-factory';

export class Repositories {

	public constructor(
		private readonly request: RepositoriesRequest) {
	}

	public get users(): UsersRepository {
		return this.request['_userRepository']
			?? (this.request['_userRepository'] = UsersRepositoryFactory.create(this.request));
	}

	public get websites(): WebsitesRepository {
		return this.request['_websitesRepository']
			?? (this.request['_websitesRepository'] = WebsitesRepositoryFactory.create(this.request));
	}
}

export interface RepositoriesRequest extends ConfigurationRequest {
	repositories: Repositories;
}

export function repositoriesMiddleware(request: RepositoriesRequest, response: Response, next: Function) {
	request.repositories = new Repositories(request);
	next();
}

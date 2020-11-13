import { mockAuthRequest } from '../../auth/auth-request-mock';
import { mockResponse } from '../../core/request-mock';
import { Repositories } from '../../repositories/repositories';
import { User, UsersRepository } from '../../repositories/users/users-repository';
import { Request } from '../request';
import { LoginAuthController, LoginBodyRequest } from './login-auth-controller';

describe('LoginAuthController', () => {

	it('get() when user is logged in then redirects to websites', () => {
		const userRequestMock = mockAuthRequest<Request>({}, 'admin');
		const responseMock = mockResponse({});

		LoginAuthController.get(userRequestMock, responseMock);

		expect(responseMock.mock.redirect).toEqual('/websites');
	});

	it('get() when user is not logged in then returns login view', () => {
		const ghostRequestMock = mockAuthRequest<Request>({});
		const responseMock = mockResponse({});

		LoginAuthController.get(ghostRequestMock, responseMock);

		expect(responseMock.mock.body).toBeDefined();
		expect(responseMock.mock.viewName).toEqual('login');
	});

	it('post() when passed correct form params then logins and redirects', () => {
		const form: LoginBodyRequest = {
			userName: 'john',
			password: 'f00'
		};
		const ghostRequestMock = mockAuthRequest<Request>({
			body: form
		});
		ghostRequestMock.repositories = mockRepositories();
		const authorizeSpy = spyOn(ghostRequestMock.auth, 'authorize');
		const responseMock = mockResponse({});

		LoginAuthController.post(ghostRequestMock, responseMock);

		expect(authorizeSpy).toHaveBeenCalled();
		expect(authorizeSpy).toHaveBeenCalled();
	});

	it('post() when passed invalid form params then returns login view', () => {
		const form: LoginBodyRequest = {
			userName: 'admin',
			password: 'admin'
		};
		const ghostRequestMock = mockAuthRequest<Request>({
			body: form
		});
		ghostRequestMock.repositories = mockRepositories();
		ghostRequestMock.__ = (k: string) => k;
		const responseMock = mockResponse({});

		LoginAuthController.post(ghostRequestMock, responseMock);

		expect(responseMock.mock.viewName).toEqual('login');
	});

	function mockRepositories(): Repositories {
		return {
			users: {
				tryGetUser: (userName: string) => {
					if (userName === 'john') {
						return {
							name: 'john',
							hashedPassword: '877fff66018379b4e2aa0e453d60afe9213f0adec989c3a2f2306cdf1834d858' // f00
						} as User;
					}
					return null;
				}
			} as UsersRepository
		} as Repositories;
	}
});

import { Response } from 'express';

import { mockAuthRequest } from '../../auth/auth-request-mock';
import { mockResponse, MockResponse } from '../../core/request-mock';
import { Request } from '../request';
import { LogoutAuthController } from './logout-auth-controller';

describe('LogoutAuthController', () => {

	let requestMock: Request;
	let responseMock: Response & MockResponse;

	beforeEach(() => {
		requestMock = mockAuthRequest({}, 'admin', 't0ken12345');
		responseMock = mockResponse({});
	});

	it('get() when passed correct token then controller logs out', () => {
		requestMock.params['token'] = 't0ken12345';

		LogoutAuthController.get(requestMock, responseMock);

		expect(requestMock.auth.isAuthorized()).toBeFalse();
		expect(responseMock.mock.redirect).toEqual('/');
	});

	it('get() when passed NOT correct token then controller throws error', () => {
		requestMock.params['token'] = 'invalid';

		expect(() => LogoutAuthController.get(requestMock, responseMock))
			.toThrowMatching((e: Error) => e.message.startsWith('The token is invalid'));
	});
});

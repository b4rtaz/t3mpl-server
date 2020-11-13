import { mockReqest, mockResponse } from '../core/request-mock';
import { HomeController } from './home-controller';

describe('HomeController', () => {

	it('get() redirects to login', () => {
		const requestMock = mockReqest({});
		const responseMock = mockResponse({});

		HomeController.get(requestMock, responseMock);

		expect(responseMock.mock.redirect).toEqual('/login');
	});
});

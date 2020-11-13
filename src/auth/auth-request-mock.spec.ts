import { mockAuthRequest } from './auth-request-mock';

describe('mockAuthRequest', () => {

	it('mockAuthRequest() when not passed user name then creates ghost session', () => {
		const ghostRequest = mockAuthRequest({});

		expect(ghostRequest.auth.isAuthorized()).toBeFalse();
	});

	it('mockAuthRequest() when passed user name then creates user session', () => {
		const ghostRequest = mockAuthRequest({}, 'admin', 't0ken');

		expect(ghostRequest.auth.isAuthorized()).toBeTrue();
		expect(ghostRequest.auth.getUserName()).toEqual('admin');
		expect(ghostRequest.auth.getLogoutToken()).toEqual('t0ken');
	});
});

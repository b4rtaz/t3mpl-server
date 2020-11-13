import { mockAuthRequest } from '../auth/auth-request-mock';
import { createCommon } from './base-view-model';

describe('createCommon', () => {

	it('createCommon() when user is not logged in then returns object without user info', () => {
		const request  = mockAuthRequest({});

		const common = createCommon(request);

		expect(common.isAuthorized).toBeFalse();
		expect(common.userName).toBeUndefined();
		expect(common.logoutUrl).toBeUndefined();
	});

	it('createCommon() when user is logged in then returns object with user info', () => {
		const request  = mockAuthRequest({}, 'r00t', 't00ken');

		const common = createCommon(request);

		expect(common.isAuthorized).toBeTrue();
		expect(common.userName).toEqual('r00t');
		expect(common.logoutUrl).toBeDefined();
	});
});

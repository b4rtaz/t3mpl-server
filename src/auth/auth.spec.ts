import { mockNext, mockReqest, mockResponse } from '../core/request-mock';
import { Auth, authMiddleware, AuthRequest, LOGOUT_TOKEN_KEY, UnauthorizedError, USER_NAME_KEY } from './auth';
import { SessionRequest } from './session';

describe('Auth', () => {

	it('mustBeAuthorized() throws error when user is not logged in', () => {
		const request = guestRequest();
		const auth = new Auth(request);

		expect(() => auth.mustBeAuthorized())
			.toThrowMatching((e: Error) => e instanceof UnauthorizedError);
	});

	it('mustBeAuthorized() does not throw error when user is logged in', () => {
		const request = userRequest();
		const auth = new Auth(request);

		expect(() => auth.mustBeAuthorized()).not.toThrow();
	});

	it('isAuthorized() returns false when session does not contain userName', () => {
		const request = guestRequest();
		const auth = new Auth(request);

		expect(auth.isAuthorized()).toBeFalse();
	});

	it('isAuthorized() returns true when session contains userName', () => {
		const request = userRequest();
		const auth = new Auth(request);

		expect(auth.isAuthorized()).toBeTrue();
	});

	it('getUserName() & getLogoutToken() return data from session', () => {
		const request = userRequest();
		const auth = new Auth(request);

		expect(auth.getUserName()).toEqual('us3r');
		expect(auth.getLogoutToken()).toEqual('tok3n');
	});

	it('authorize() changes session state', () => {
		const request = guestRequest();
		const auth = new Auth(request);

		expect(auth.isAuthorized()).toBeFalse();

		auth.authorize('steven');

		expect(auth.isAuthorized()).toBeTrue();
		expect(request.session[USER_NAME_KEY]).toEqual('steven');
		expect(request.session[LOGOUT_TOKEN_KEY]).not.toBeUndefined();
	});

	it('authorize() throws error when user is authorized', () => {
		const request = userRequest();
		const auth = new Auth(request);

		expect(() => auth.authorize('root'))
			.toThrowMatching((e: Error) => e.message.startsWith('You are already authorized'));
	});

	it('forget() changes session state', () => {
		const request = userRequest();
		const auth = new Auth(request);

		expect(auth.isAuthorized()).toBeTrue();

		auth.forget();

		expect(auth.isAuthorized()).toBeFalse();
	});

	//

	function userRequest(): SessionRequest {
		const session = {};
		session[USER_NAME_KEY] = 'us3r';
		session[LOGOUT_TOKEN_KEY] = 'tok3n';
		return createRequest(session);
	}

	function guestRequest(): SessionRequest {
		return createRequest({});
	}

	function createRequest(session: {}): SessionRequest {
		const request = mockReqest<SessionRequest>({});
		request.session = session;
		return request;
	}
});

describe('auth middleware', () => {

	it('authMiddleware() injects auth to request', () => {
		const request = mockReqest<AuthRequest>({});
		const response = mockResponse({});
		const next = mockNext();

		authMiddleware(request, response, next.mock);

		expect(next.called);
		expect(request.auth).toBeDefined();
	});
});

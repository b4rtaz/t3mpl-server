import { MockArgsRequest, mockReqest } from '../core/request-mock';
import { Auth, AuthRequest, LOGOUT_TOKEN_KEY, USER_NAME_KEY } from './auth';

export function mockAuthRequest<T extends AuthRequest>(args: MockArgsRequest, userName?: string, logoutToken?: string): T {
	const request = mockReqest<T>(args);
	request.session = {};
	if (userName) {
		request.session[USER_NAME_KEY] = userName;
		request.session[LOGOUT_TOKEN_KEY] = logoutToken;
	}
	request.auth = new Auth(request);
	return request;
}

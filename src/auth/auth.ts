import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { SessionRequest } from './session';

export const USER_NAME_KEY = 'user';
export const LOGOUT_TOKEN_KEY = 'logout';

export class Auth {

	public constructor(
		private readonly request: SessionRequest) {
	}

	public isAuthorized(): boolean {
		return !!this.request.session[USER_NAME_KEY];
	}

	public authorize(userName: string) {
		if (this.isAuthorized()) {
			throw new Error('You are already authorized.');
		}
		this.request.session[USER_NAME_KEY] = userName;
		this.request.session[LOGOUT_TOKEN_KEY] = uuidv4();
	}

	public mustBeAuthorized() {
		if (!this.isAuthorized()) {
			throw new UnauthorizedError('Sorry! This area is restricted. You must be logged in.');
		}
	}

	public forget() {
		this.mustBeAuthorized();
		delete this.request.session[USER_NAME_KEY];
		delete this.request.session[LOGOUT_TOKEN_KEY];
	}

	public getUserName(): string {
		this.mustBeAuthorized();
		return this.request.session[USER_NAME_KEY];
	}

	public getLogoutToken() {
		this.mustBeAuthorized();
		return this.request.session[LOGOUT_TOKEN_KEY];
	}
}

export class UnauthorizedError extends Error {
}

export interface AuthRequest extends SessionRequest {
	auth: Auth;
}

export function authMiddleware(request: AuthRequest, response: Response, next: Function) {
	request.auth = new Auth(request);
	next();
}

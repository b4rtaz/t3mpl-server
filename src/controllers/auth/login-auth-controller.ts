import { Response } from 'express';

import { comparePassword } from '../../auth/compare-password';
import { BaseViewModel, createCommon } from '../base-view-model';
import { Request } from '../request';

export class LoginAuthController {

	public static get(request: Request, response: Response) {
		if (request.auth.isAuthorized()) {
			redirectToWebsites(response);
		} else {
			renderLogin(request, response);
		}
	}

	public static post(request: Request, response: Response) {
		const body = request.body as LoginBodyRequest;

		const user = request.repositories.users.tryGetUser(body.userName);

		if (user && comparePassword(body.password, user.hashedPassword)) {
			request.auth.authorize(user.name);
			redirectToWebsites(response);
		} else {
			renderLogin(request, response, body.userName, request.__('login.invalidUserOrPassword'));
		}
	}
}

function renderLogin(request: Request, response: Response, userName?: string, errorMessage?: string) {
	const vm: LoginViewModel = {
		common: createCommon(request),
		userName,
		errorMessage
	};
	response.render('login', vm);
}

function redirectToWebsites(response: Response) {
	response.redirect('/websites');
}

interface LoginViewModel extends BaseViewModel {
	errorMessage?: string;
	userName?: string;
}

export interface LoginBodyRequest {
	userName: string;
	password: string;
}

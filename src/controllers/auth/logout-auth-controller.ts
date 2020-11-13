import { Response } from 'express';

import { Request } from '../request';

export class LogoutAuthController {

	public static get(request: Request, response: Response) {
		request.auth.mustBeAuthorized();

		const token = request.params['token'];
		if (token !== request.auth.getLogoutToken()) {
			throw new Error('The token is invalid.');
		}

		request.auth.forget();
		response.redirect('/');
	}
}

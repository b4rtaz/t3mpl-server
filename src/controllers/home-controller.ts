import { Request, Response } from 'express';

export class HomeController {

	public static get(request: Request, response: Response) {
		response.redirect('/login');
	}
}

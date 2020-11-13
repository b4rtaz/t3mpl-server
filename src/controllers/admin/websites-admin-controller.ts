import { Response } from 'express';

import { BaseViewModel, createCommon } from '../base-view-model';
import { Request } from '../request';

export class WebsitesAdminController {

	public static getWebsites(request: Request, response: Response) {
		request.auth.mustBeAuthorized();

		const websites = request.repositories.websites.getWebsites(request.auth.getUserName());
		const vm: WebsitesViewModel = {
			common: createCommon(request),
			websites: websites.map(w => {
				return {
					name: w.name,
					editUrl: '/editor/#website=../websites/' + encodeURIComponent(w.name)
				};
			})
		};

		response.render('websites', vm);
	}
}

export interface WebsitesViewModel extends BaseViewModel {
	websites: WebsiteItem[];
}

interface WebsiteItem {
	name: string;
	editUrl: string;
}

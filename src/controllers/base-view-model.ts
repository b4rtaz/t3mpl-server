import { AuthRequest } from '../auth/auth';

export interface BaseViewModel {
	common: CommonModel;
}

export interface CommonModel {
	isAuthorized: boolean;
	userName?: string;
	logoutUrl?: string;
}

export function createCommon(request: AuthRequest) {
	const isAuthorized = request.auth.isAuthorized();
	const common: CommonModel = {
		isAuthorized
	};
	if (isAuthorized) {
		common.userName = request.auth.getUserName();
		common.logoutUrl = '/logout/' + request.auth.getLogoutToken();
	}
	return common;
}

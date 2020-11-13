export interface WebsitesRepository {

	getWebsites(owner: string): Website[];
	tryGetWebsite(owner: string, name: string): Website;
}

export interface Website {
	name: string;
	owner: string;
	templateDirPath: string;
	dataDirPath: string;
	releaseDirPath: string;
}

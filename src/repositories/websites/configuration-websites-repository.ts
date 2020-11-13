import { ConfigurationRequest } from '../../configuration/configuration';
import { Website, WebsitesRepository } from './websites-repository';

export class ConfigurationWebsitesRepository implements WebsitesRepository {

	public constructor(
		private readonly request: ConfigurationRequest) {
	}

	public getWebsites(owner: string): Website[] {
		return this.request.configuration.websites.filter(w => w.owner === owner);
	}

	public tryGetWebsite(owner: string, name: string): Website {
		const websites = this.request.configuration.websites.filter(w => w.owner === owner && w.name === name);
		return websites.length > 0 ? websites[0] : null;
	}
}

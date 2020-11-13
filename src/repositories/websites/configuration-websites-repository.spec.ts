import { Configuration, ConfigurationRequest } from '../../configuration/configuration';
import { mockReqest } from '../../core/request-mock';
import { ConfigurationWebsitesRepository } from './configuration-websites-repository';

describe('ConfigurationWebsitesRepository', () => {

	let repository: ConfigurationWebsitesRepository;

	beforeEach(() => {
		const request = mockReqest<ConfigurationRequest>({});
		request.configuration = {
			websites: [
				{
					name: 'blog',
					owner: 'admin',
					dataDirPath: './data',
					templateDirPath: './template',
					releaseDirPath: '/release'
				}
			]
		} as Configuration;

		repository = new ConfigurationWebsitesRepository(request);
	});

	it('tryGetWebsite() returns website from configuration', () => {
		const website = repository.tryGetWebsite('admin', 'blog');

		expect(website).toBeDefined();
		expect(website.name).toEqual('blog');
		expect(website.owner).toEqual('admin');
		expect(website.dataDirPath).toEqual('./data');
	});

	it('tryGetWebsite() returns null when when cannot find a website', () => {
		const website = repository.tryGetWebsite('root', 'news');

		expect(website).toBeNull();
	});

	it('getWebsites() returns websites for owner', () => {
		const websites = repository.getWebsites('admin');

		expect(websites.length).toEqual(1);
		expect(websites[0].name).toEqual('blog');
	});
});

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
					dataDirPath: './blog/data',
					templateDirPath: './blog/template',
					releaseDirPath: './blog/release'
				},
				{
					name: 'news',
					owner: 'writer',
					dataDirPath: './news/data',
					templateDirPath: './news/template',
					releaseDirPath: './news/release',
					keepReleaseFiles: ['.gitignore']
				}
			]
		} as Configuration;

		repository = new ConfigurationWebsitesRepository(request);
	});

	it('tryGetWebsite() returns correctly converted website', () => {
		const website = repository.tryGetWebsite('admin', 'blog');

		expect(website).toBeDefined();
		expect(website.name).toEqual('blog');
		expect(website.owner).toEqual('admin');
		expect(website.dataDirPath).toEqual('./blog/data');
		expect(website.templateDirPath).toEqual('./blog/template');
		expect(website.releaseDirPath).toEqual('./blog/release');
		expect(Array.isArray(website.keepReleaseFiles)).toBeTrue();
	});

	it('tryGetWebsite() returns website from configuration', () => {
		const website = repository.tryGetWebsite('writer', 'news');

		expect(website).toBeDefined();
		expect(website.name).toEqual('news');
		expect(website.owner).toEqual('writer');
		expect(website.dataDirPath).toEqual('./news/data');
		expect(website.templateDirPath).toEqual('./news/template');
		expect(website.releaseDirPath).toEqual('./news/release');
		expect(website.keepReleaseFiles).toContain('.gitignore');
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

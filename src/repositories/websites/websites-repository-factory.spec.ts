import { Configuration, ConfigurationRequest, DatabaseDriver } from '../../configuration/configuration';
import { mockReqest } from '../../core/request-mock';
import { ConfigurationWebsitesRepository } from './configuration-websites-repository';
import { WebsitesRepositoryFactory } from './websites-repository-factory';

describe('WebsitesRepositoryFactory', () => {

	function createRequest(driver: DatabaseDriver) {
		const request = mockReqest<ConfigurationRequest>({});
		request.configuration = {
			database: {
				driver: driver
			}
		} as Configuration;
		return request;
	}

	it('create() creates configuration respository', () => {
		const request = createRequest('configuration');

		const repository = WebsitesRepositoryFactory.create(request);

		expect(repository instanceof ConfigurationWebsitesRepository).toBeTrue();
	});

	it('create() throws error when driver is not supported', () => {
		const request = createRequest(<any>'NOT_SUPPORTED');

		expect(() => WebsitesRepositoryFactory.create(request))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported database driver'));
	});
});

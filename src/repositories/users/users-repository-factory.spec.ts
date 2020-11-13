import { Configuration, ConfigurationRequest, DatabaseDriver } from '../../configuration/configuration';
import { mockReqest } from '../../core/request-mock';
import { ConfigurationUsersRepository } from './configuration-users-repository';
import { UsersRepositoryFactory } from './users-repository-factory';

describe('UsersRepositoryFactory', () => {

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

		const repository = UsersRepositoryFactory.create(request);

		expect(repository instanceof ConfigurationUsersRepository).toBeTrue();
	});

	it('create() throws error when driver is not supported', () => {
		const request = createRequest(<any>'NOT_SUPPORTED');

		expect(() => UsersRepositoryFactory.create(request))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported database driver'));
	});
});

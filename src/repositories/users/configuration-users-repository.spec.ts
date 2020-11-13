import { Configuration, ConfigurationRequest } from '../../configuration/configuration';
import { mockReqest } from '../../core/request-mock';
import { ConfigurationUsersRepository } from './configuration-users-repository';

describe('ConfigurationUsersRepository', () => {

	let repository: ConfigurationUsersRepository;

	beforeEach(() => {
		const request = mockReqest<ConfigurationRequest>({});
		request.configuration = {
			users: [
				{
					name: 'root',
					hashedPassword: 'p4ssw0rd'
				}
			]
		} as Configuration;

		repository = new ConfigurationUsersRepository(request);
	});

	it('tryGetUser() returns user from configuration', () => {
		const user = repository.tryGetUser('root');

		expect(user).toBeDefined();
		expect(user.name).toEqual('root');
		expect(user.hashedPassword).toEqual('p4ssw0rd');
	});

	it('tryGetUser() returns null when cannot find an user', () => {
		const user = repository.tryGetUser('unknown');

		expect(user).toBeNull();
	});
});

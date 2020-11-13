import { ConfigurationRequest } from '../../configuration/configuration';
import { ConfigurationUsersRepository } from './configuration-users-repository';
import { UsersRepository } from './users-repository';

export class UsersRepositoryFactory {

	public static create(request: ConfigurationRequest): UsersRepository {
		const driver = request.configuration.database.driver;
		switch (driver) {
			case 'configuration':
				return new ConfigurationUsersRepository(request);
			default:
				throw new Error(`Not supported database driver ${driver}.`);
		}
	}
}

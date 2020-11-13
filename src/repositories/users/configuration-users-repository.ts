import { ConfigurationRequest } from '../../configuration/configuration';
import { User, UsersRepository } from './users-repository';

export class ConfigurationUsersRepository implements UsersRepository {

	public constructor(
		private readonly request: ConfigurationRequest) {
	}

	public tryGetUser(userName: string): User {
		const users = this.request.configuration.users.filter(u => u.name === userName);
		return users.length > 0 ? users[0] : null;
	}
}

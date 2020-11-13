export interface UsersRepository {

	tryGetUser(userName: string): User;
}

export interface User {
	name: string;
	hashedPassword: string;
}

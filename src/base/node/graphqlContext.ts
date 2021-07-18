import { UsersRepositoryInterface } from './repositories/usersRepository';

export interface GraphQLContext {
	sources: {
		users: UsersRepositoryInterface;
	};
}

import { Mongoose } from 'mongoose';
import { UsersRepository, UsersRepositoryInterface } from './repositories/usersRepository';

export interface DataSourcesInterface {
	users: UsersRepositoryInterface;
}

export function DataSources(mongoose: Mongoose): DataSourcesInterface {
	const users = UsersRepository(mongoose);

	return Object.freeze<DataSourcesInterface>({
		users,
	});
}

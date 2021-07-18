import { Db } from 'mongodb';
import { UsersRepository, UsersRepositoryInterface } from './repositories/usersRepository';

export interface DataSourcesInterface {
	users: UsersRepositoryInterface;
}

export function DataSources(db: Db): DataSourcesInterface {
	const users = UsersRepository(db);

	return Object.freeze<DataSourcesInterface>({
		users,
	});
}

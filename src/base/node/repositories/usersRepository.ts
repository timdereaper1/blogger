import { Db } from 'mongodb';
import type { DBUser, UserSchema } from './types';

export interface UsersRepositoryInterface {
	findByEmail: (email: string) => Promise<DBUser>;
	insert: (args: UserSchema) => Promise<DBUser>;
}

export function UsersRepository(db: Db) {
	async function findByEmail(email: string): Promise<DBUser> {
		const collection = db.collection<DBUser>('users');
		const user = await collection.findOne({ email });
		if (!user) throw new Error('Email does not exists');
		return user;
	}

	async function insert(args: UserSchema): Promise<DBUser> {
		const collection = db.collection<DBUser>('users');
		const existingUser = await collection.findOne({ email: args.email });
		if (existingUser) throw new Error('Email already exists');
		const user = await db.collection<UserSchema>('users').insertOne(args);
		return {
			...args,
			_id: user.insertedId.toHexString(),
		};
	}

	return Object.freeze<UsersRepositoryInterface>({
		findByEmail,
		insert,
	});
}

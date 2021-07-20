import { Db, ObjectId } from 'mongodb';
import { BadRequestError } from 'src/base/common/errors';
import type { DBUser, UserSchema } from './types';

export interface UsersRepositoryInterface {
	findByEmail: (email: string) => Promise<DBUser>;
	insert: (args: UserSchema) => Promise<DBUser>;
}

export function UsersRepository(db: Db) {
	async function findByEmail(email: string): Promise<DBUser> {
		const collection = db.collection<UserSchema & { _id: ObjectId }>('users');
		const user = await collection.findOne({ email });
		if (!user) throw new BadRequestError('Email does not exists');
		return {
			...user,
			_id: user._id.toHexString(),
		};
	}

	async function insert(args: UserSchema): Promise<DBUser> {
		const collection = db.collection<DBUser>('users');
		const existingUser = await collection.findOne({ email: args.email });
		if (existingUser) throw new BadRequestError('Email already exists');
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

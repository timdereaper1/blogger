import { Db, ObjectId } from 'mongodb';
import { BadRequestError } from 'src/base/common/errors';
import type { DBUser, UserSchema } from './types';

export interface UsersRepositoryInterface {
	findByEmail: (email: string) => Promise<DBUser>;
	insert: (args: UserSchema) => Promise<DBUser>;
	update: (id: string, data: Partial<UserSchema>) => Promise<DBUser>;
}

type MongoUser = UserSchema & { _id: ObjectId };

export function UsersRepository(db: Db) {
	async function findByEmail(email: string): Promise<DBUser> {
		const collection = db.collection<MongoUser>('users');
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

	async function update(_id: string, data: Partial<UserSchema>): Promise<DBUser> {
		const collection = db.collection<MongoUser>('users');
		const user = await collection.findOneAndUpdate({ _id } as any, data);
		if (!user.value) throw new BadRequestError('Record does not exist');
		return {
			...user.value,
			_id: user.value._id.toHexString(),
		};
	}

	return Object.freeze<UsersRepositoryInterface>({
		findByEmail,
		insert,
		update,
	});
}

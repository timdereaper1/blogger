import { Document, Mongoose } from 'mongoose';
import type { DBUser, UserSchema } from '../schemas/types';
import { userSchema } from '../schemas/userSchema';

export interface UsersRepositoryInterface {
	findByEmail: (email: string) => Promise<DBUser>;
	insert: (args: UserSchema) => Promise<DBUser>;
}

type MongoUser = UserSchema & Document<any, any, UserSchema>;

export function usersRepository(mongoose: Mongoose) {
	const UserModel = mongoose.model<UserSchema>('User', userSchema);

	function convertMongoUserToDBUser(user: MongoUser): DBUser {
		return Object.freeze<DBUser>({
			_id: user._id,
			name: user.name,
			email: user.email,
			password: user.password,
		});
	}

	async function findByEmail(email: string): Promise<DBUser> {
		const user = await UserModel.findOne({ email }).exec();
		if (!user) throw new Error('Email does not exists');
		return convertMongoUserToDBUser(user);
	}

	async function insert(args: UserSchema): Promise<DBUser> {
		const existingUser = await UserModel.exists({ email: args.email });
		if (existingUser) throw new Error('Email already exists');
		const user = await new UserModel(args).save();
		return convertMongoUserToDBUser(user);
	}

	return Object.freeze<UsersRepositoryInterface>({
		findByEmail,
		insert,
	});
}

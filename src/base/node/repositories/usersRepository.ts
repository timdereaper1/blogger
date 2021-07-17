import { Mongoose } from 'mongoose';
import type { UserSchema } from '../schemas/types';
import { userSchema } from '../schemas/userSchema';

export interface UsersRepositoryInterface {
	findByEmail: (email: string) => Promise<UserSchema>;
	insert: (args: UserSchema) => Promise<UserSchema>;
}

export function usersRepository(mongoose: Mongoose) {
	const UserModel = mongoose.model<UserSchema>('User', userSchema);

	async function findByEmail(email: string): Promise<UserSchema> {
		const user = await UserModel.findOne({ email }).exec();
		if (!user) throw new Error('Email does not exists');
		return user.toJSON();
	}

	async function insert(args: UserSchema): Promise<UserSchema> {
		const existingUser = await UserModel.exists({ email: args.email });
		if (existingUser) throw new Error('Email already exists');
		const user = await new UserModel(args).save();
		return user.toJSON();
	}

	return Object.freeze<UsersRepositoryInterface>({
		findByEmail,
		insert,
	});
}

import { Schema } from 'mongoose';
import { UserSchema } from './types';

export const userSchema = new Schema<UserSchema>({
	name: String,
	password: String,
	email: String,
});

import { config } from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import {
	usersRepository,
	UsersRepositoryInterface,
} from '../../../../src/base/node/repositories/usersRepository';
import { UserSchema } from '../../../../src/base/node/schemas/types';

config({
	path: path.join(process.cwd(), '.env.local'),
});

describe('usersRepository', () => {
	let connection: mongoose.Mongoose;
	let repository: UsersRepositoryInterface;

	const testUser: UserSchema = {
		email: 'test@test.com',
		password: '123456',
		name: 'John Doe',
	};

	beforeAll(async () => {
		connection = await mongoose.connect(process.env.TEST_MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		repository = usersRepository(connection);
	});

	afterAll(async () => {
		await connection.connection.dropCollection('users');
		await connection.disconnect();
	});

	describe('insert', () => {
		it('should add and return the user with an id', async () => {
			const user = await repository.insert(testUser);
			expect(user).toHaveProperty('email', testUser.email);
			expect(user).toHaveProperty('password', testUser.password);
			expect(user).toHaveProperty('name', testUser.name);
			expect(user).toHaveProperty('_id');
		});

		it('should throw error when user already exists', async () => {
			const user: UserSchema = {
				email: 'user.email@domain.com',
				password: '123456',
				name: 'Testing User',
			};
			await repository.insert(user);
			expect(repository.insert(user)).rejects.toThrow('Email already exists');
		});
	});

	describe('findByEmail', () => {
		it('should return the user that has the same email', async () => {
			const user = await repository.findByEmail(testUser.email);
			expect(user).toHaveProperty('email', 'test@test.com');
			expect(user).toHaveProperty('password', '123456');
			expect(user).toHaveProperty('name', 'John Doe');
			expect(user).toHaveProperty('_id');
		});

		it('should throw error when email does not exist', async () => {
			expect(repository.findByEmail('undefined')).rejects.toThrow('Email does not exists');
		});
	});
});

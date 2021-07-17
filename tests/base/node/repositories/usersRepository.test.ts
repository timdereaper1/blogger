import { config } from 'dotenv';
import faker from 'faker';
import path from 'path';
import {
	usersRepository,
	UsersRepositoryInterface,
} from '../../../../src/base/node/repositories/usersRepository';
import { DBUser, UserSchema } from '../../../../src/base/node/schemas/types';

config({
	path: path.join(process.cwd(), '.env.local'),
});

describe('usersRepository', () => {
	let repository: UsersRepositoryInterface;

	const testUser: UserSchema = {
		email: faker.internet.email(),
		password: faker.internet.password(),
		name: faker.name.findName(),
	};

	const dbUser: DBUser = {
		email: testUser.email,
		password: testUser.password,
		name: testUser.name,
		_id: faker.datatype.uuid(),
	};

	const mockModel = {
		findOne: jest.fn().mockReturnValue({
			exec: jest.fn().mockResolvedValueOnce(dbUser),
		}),
		exists: jest.fn().mockResolvedValue(false),
		create: jest.fn().mockResolvedValue(dbUser),
	};

	const mockConnection = {
		model: jest.fn().mockReturnValue(mockModel),
	};

	beforeAll(async () => {
		repository = usersRepository(mockConnection as any);
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
			mockModel.exists.mockResolvedValueOnce(true);
			expect(repository.insert(testUser)).rejects.toThrow('Email already exists');
		});
	});

	describe('findByEmail', () => {
		it('should return the user that has the same email', async () => {
			const user = await repository.findByEmail(testUser.email);
			expect(user).toHaveProperty('email', testUser.email);
			expect(user).toHaveProperty('password', testUser.password);
			expect(user).toHaveProperty('name', testUser.name);
			expect(user).toHaveProperty('_id');
		});

		it('should throw error when email does not exist', async () => {
			mockModel.findOne.mockReturnValueOnce({ exec: jest.fn().mockResolvedValueOnce(null) });
			expect(repository.findByEmail(faker.internet.email())).rejects.toThrow(
				'Email does not exists'
			);
		});
	});
});

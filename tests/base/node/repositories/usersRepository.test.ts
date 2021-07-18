import faker from 'faker';
import { DBUser, UserSchema } from 'src/base/node/repositories/types';
import {
	UsersRepository,
	UsersRepositoryInterface,
} from 'src/base/node/repositories/usersRepository';

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
		findOne: jest.fn().mockReturnValue(dbUser),
		insertOne: jest.fn().mockResolvedValue({
			...dbUser,
			insertedId: {
				toHexString: () => dbUser._id,
			},
		}),
	};

	const dbMock = {
		collection: jest.fn().mockReturnValue(mockModel),
	};

	beforeAll(async () => {
		repository = UsersRepository(dbMock as any);
	});

	describe('insert', () => {
		it('should add and return the user with an id', async () => {
			mockModel.findOne.mockResolvedValueOnce(undefined);
			const user = await repository.insert(testUser);
			expect(user).toHaveProperty('email', testUser.email);
			expect(user).toHaveProperty('password', testUser.password);
			expect(user).toHaveProperty('name', testUser.name);
			expect(user).toHaveProperty('_id');
		});

		it('should throw error when user already exists', async () => {
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
			mockModel.findOne.mockReturnValueOnce(undefined);
			expect(repository.findByEmail(faker.internet.email())).rejects.toThrow(
				'Email does not exists'
			);
		});
	});
});

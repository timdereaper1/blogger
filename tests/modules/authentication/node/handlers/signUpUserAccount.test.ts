import faker from 'faker';
import { BadRequestError } from 'src/base/common/errors';
import { DBUser } from 'src/base/node/repositories/types';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { UserSignUpCredentials } from 'src/modules/authentication/common/types';
import { signUpUserAccount } from 'src/modules/authentication/node/handlers/signUpUserAccount';
import { MockUsersRepository } from 'tests/base/node/repositories/types';

jest.mock('src/base/node/tokens');
jest.mock('src/base/node/logging');

type CreateToken = typeof createAuthenticationToken;
const mockedCreateToken = createAuthenticationToken as jest.MockedFunction<CreateToken>;

describe('signUpUserAccount', () => {
	const signUpCredentials: UserSignUpCredentials = {
		email: faker.internet.email(),
		password: faker.internet.password(),
		name: faker.name.findName(),
		privileges: ['user'],
	};
	const dbUser: DBUser = {
		name: signUpCredentials.name,
		email: signUpCredentials.email,
		_id: faker.datatype.uuid(),
		privileges: ['user', 'super_admin'],
		password: faker.internet.password(),
	};
	const usersRepository: MockUsersRepository = {
		findByEmail: jest.fn(),
		insert: jest.fn().mockResolvedValue(dbUser),
	};

	beforeEach(async () => {
		mockedCreateToken.mockReturnValue('token');
	});

	afterEach(() => {
		usersRepository.insert.mockReset();
	});

	it('should return the user with a token and id', async () => {
		const user = await signUpUserAccount(usersRepository, signUpCredentials);
		expect(user).toHaveProperty('id', dbUser._id);
		expect(user).toHaveProperty('token', 'token');
		expect(user).toHaveProperty('privileges');
	});

	it('should throw an error if email already exists', async () => {
		const mockedRepository: any = {
			insert: () => {
				throw new BadRequestError('Email already exists');
			},
			findByEmail: jest.fn(),
		};
		const promise = signUpUserAccount(mockedRepository, signUpCredentials);
		expect(promise).rejects.toThrow('Email already exists');
	});
});

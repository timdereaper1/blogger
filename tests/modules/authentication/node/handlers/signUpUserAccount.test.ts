import faker from 'faker';
import { BadRequestError } from 'src/base/common/errors';
import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { UserSignUpCredentials } from 'src/modules/authentication/common/types';
import { signUpUserAccount } from 'src/modules/authentication/node/handlers/signUpUserAccount';

jest.mock('src/base/node/tokens');
jest.mock('src/base/node/logging');

type CreateToken = typeof createAuthenticationToken;
type MockedRepository = Record<keyof UsersRepositoryInterface, jest.Mock<any, any>>;

const mockedCreateToken = createAuthenticationToken as jest.MockedFunction<CreateToken>;

describe('signUpUserAccount', () => {
	const signUpCredentials: UserSignUpCredentials = {
		email: faker.internet.email(),
		password: faker.internet.password(),
		name: faker.name.findName(),
	};
	const dbUser = {
		name: signUpCredentials.name,
		email: signUpCredentials.email,
		_id: faker.datatype.uuid(),
	};
	const usersRepository: MockedRepository = {
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

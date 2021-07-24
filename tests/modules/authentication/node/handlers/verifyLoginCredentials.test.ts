import * as argon from 'argon2';
import faker from 'faker';
import { BadRequestError } from 'src/base/common/errors';
import { DBUser } from 'src/base/node/repositories/types';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { verifyLoginCredentials } from 'src/modules/authentication/node/handlers/verifyLoginCredentials';
import { MockUsersRepository } from 'tests/base/node/repositories/types';

jest.mock('src/base/node/tokens');
jest.mock('src/base/node/logging');

type CreateToken = typeof createAuthenticationToken;
const mockedCreateToken = createAuthenticationToken as jest.MockedFunction<CreateToken>;

describe('verifyLoginCredentials', () => {
	let dbUser: DBUser;
	let userRepository: MockUsersRepository;
	const credentials = {
		password: faker.internet.password(),
		email: faker.internet.email(),
	};

	beforeEach(async () => {
		mockedCreateToken.mockReturnValue('token');
		dbUser = {
			name: faker.name.findName(),
			email: credentials.email,
			_id: faker.datatype.uuid(),
			password: await argon.hash(credentials.password),
			privileges: ['super_admin', 'user'],
		};
		userRepository = {
			findByEmail: jest.fn().mockResolvedValue(dbUser),
			insert: jest.fn().mockResolvedValue(dbUser),
			update: jest.fn(),
		};
	});

	afterEach(() => {
		userRepository.findByEmail.mockReset();
		userRepository.insert.mockReset();
		mockedCreateToken.mockReset();
	});

	it('should throw error if password does not match', () => {
		const promise = verifyLoginCredentials(userRepository, {
			...credentials,
			password: 'undefined',
		});
		expect(promise).rejects.toThrow('Invalid login credentials');
	});

	it('should return the user when credentials match', () => {
		const promise = verifyLoginCredentials(userRepository, credentials);
		expect(promise).resolves.toEqual({
			id: dbUser._id,
			email: dbUser.email,
			name: dbUser.name,
			token: 'token',
			privileges: ['super_admin', 'user'],
		});
	});

	it('should create a token user id', async () => {
		await verifyLoginCredentials(userRepository, credentials);
		expect(mockedCreateToken).toHaveBeenCalledWith(dbUser._id);
	});

	it('should throw an error if user does not exist', () => {
		userRepository.findByEmail.mockRejectedValueOnce(
			new BadRequestError('Email does not exist')
		);
		const promise = verifyLoginCredentials(userRepository, {
			email: 'undefined',
			password: 'undefined',
		});
		expect(promise).rejects.toThrow('Invalid login credentials');
	});
});

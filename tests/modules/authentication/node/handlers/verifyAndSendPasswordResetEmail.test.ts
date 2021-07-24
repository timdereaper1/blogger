import faker from 'faker';
import { BadRequestError } from 'src/base/common/errors';
import { DBUser } from 'src/base/node/repositories/types';
import { sendEmail } from 'src/base/node/services/mailing';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { UserPasswordResetCredentials } from 'src/modules/authentication/common/types';
import { verifyAndSendPasswordResetEmail } from 'src/modules/authentication/node/handlers/verifyAndSendPasswordResetEmail';
import { getPasswordResetEmail } from 'src/modules/authentication/node/templates/passwordResetEmail';
import { MockUsersRepository } from 'tests/base/node/repositories/types';

jest.mock('src/base/node/services/mailing');
jest.mock('src/base/node/tokens');
jest.mock('src/modules/authentication/node/templates/passwordResetEmail');
jest.mock('src/base/node/logging');

const mockedPasswordResetEmail = getPasswordResetEmail as jest.MockedFunction<
	typeof getPasswordResetEmail
>;
const mockedSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockedCreateToken = createAuthenticationToken as jest.MockedFunction<
	typeof createAuthenticationToken
>;

describe('verifyAndSendPasswordResetEmail', () => {
	const usersRepository: MockUsersRepository = {
		findByEmail: jest.fn(),
		insert: jest.fn(),
	};

	const credentials: UserPasswordResetCredentials = {
		email: faker.internet.email(),
	};

	const user: DBUser = {
		_id: faker.datatype.uuid(),
		email: credentials.email,
		name: faker.name.findName(),
		password: faker.random.alphaNumeric(),
		privileges: ['super_admin', 'user'],
	};

	afterEach(() => {
		mockedSendEmail.mockReset();
		usersRepository.findByEmail.mockReset();
		mockedCreateToken.mockReset();
	});

	it('should send password reset email to client email address when found', async () => {
		usersRepository.findByEmail.mockResolvedValueOnce(user);
		mockedPasswordResetEmail.mockReturnValueOnce('Message to reset password');
		await verifyAndSendPasswordResetEmail(usersRepository, credentials);
		expect(mockedSendEmail).toHaveBeenCalledTimes(1);
		expect(mockedSendEmail).toHaveBeenCalledWith(
			credentials.email,
			'Blogger: Password Reset',
			'Message to reset password'
		);
	});

	it('should create a token to attach to the the email', async () => {
		usersRepository.findByEmail.mockResolvedValueOnce(user);
		mockedCreateToken.mockReturnValueOnce('token');
		await verifyAndSendPasswordResetEmail(usersRepository, credentials);
		expect(mockedCreateToken).toHaveBeenCalledWith(user._id);
	});

	it('should throw an error if the email does not exists', async () => {
		usersRepository.findByEmail.mockRejectedValueOnce(
			new BadRequestError('Email does not exist')
		);
		const promise = verifyAndSendPasswordResetEmail(usersRepository, credentials);
		expect(promise).rejects.toThrow('Invalid email account');
		expect(mockedSendEmail).not.toHaveBeenCalled();
	});

	it('should return a success and message when email is sent', async () => {
		usersRepository.findByEmail.mockResolvedValueOnce(user);
		mockedPasswordResetEmail.mockReturnValueOnce('Message to reset password');
		const result = await verifyAndSendPasswordResetEmail(usersRepository, credentials);
		expect(result).toEqual({
			message: `Reset password email has been sent to ${user.name}`,
			success: true,
		});
	});
});

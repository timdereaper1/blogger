import { AuthenticationError } from 'apollo-server-micro';
import { processRequestError } from 'src/base/node/errorHandling';
import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { sendEmail } from 'src/base/node/services/mailing';
import { createExpiryAuthenticationToken } from 'src/base/node/tokens';
import { UserPasswordResetCredentials } from 'src/modules/authentication/common/types';
import { getPasswordResetEmail } from 'src/modules/authentication/node/templates/passwordResetEmail';

export async function verifyAndSendPasswordResetEmail(
	usersRepository: UsersRepositoryInterface,
	credentials: UserPasswordResetCredentials
) {
	try {
		const user = await usersRepository.findByEmail(credentials.email);
		const token = createExpiryAuthenticationToken(user._id);
		const message = getPasswordResetEmail(user.name, token);
		sendEmail(user.email, 'Blogger: Password Reset', message);
		return {
			message: `Reset password email has been sent to ${user.name}`,
			success: true,
		};
	} catch (error) {
		processRequestError(error, new AuthenticationError('Invalid email account'));
	}
}

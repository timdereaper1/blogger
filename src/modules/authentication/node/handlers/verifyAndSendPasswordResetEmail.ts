import { AuthenticationError } from 'apollo-server-micro';
import { processRequestError } from 'src/base/node/errorHandling';
import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { sendEmail } from 'src/base/node/services/mailing';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { UserPasswordResetCredentials } from 'src/modules/authentication/common/types';

export async function verifyAndSendPasswordResetEmail(
	usersRepository: UsersRepositoryInterface,
	credentials: UserPasswordResetCredentials
) {
	try {
		const user = await usersRepository.findByEmail(credentials.email);
		const token = createAuthenticationToken(user._id);
		// TODO: create password reset template
		sendEmail(credentials.email, 'Blogger: Password Reset', '');
	} catch (error) {
		processRequestError(error, new AuthenticationError('Invalid email account'));
	}
}

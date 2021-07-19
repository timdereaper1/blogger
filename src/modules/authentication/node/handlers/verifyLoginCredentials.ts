import { AuthenticationError } from 'apollo-server-micro';
import * as argon from 'argon2';
import { BadRequestError } from 'src/base/common/errors';
import { processRequestError } from 'src/base/node/errorHandling';
import type { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { createAuthenticationToken } from 'src/base/node/tokens';
import type { LoggedInUser, UserLoginCredentials } from 'src/modules/authentication/common/types';

export async function verifyLoginCredentials(
	usersRepository: UsersRepositoryInterface,
	credentials: UserLoginCredentials
): Promise<LoggedInUser> {
	try {
		const user = await usersRepository.findByEmail(credentials.email);
		const validPassword = await argon.verify(user.password, credentials.password);
		if (!validPassword) throw new BadRequestError('Invalid password');
		const token = createAuthenticationToken(user._id);
		return {
			email: user.email,
			name: user.name,
			token,
			id: user._id,
		};
	} catch (error) {
		processRequestError(error, new AuthenticationError('Invalid login credentials'));
	}
}

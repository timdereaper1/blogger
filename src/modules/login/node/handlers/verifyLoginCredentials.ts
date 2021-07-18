import * as argon from 'argon2';
import { processErrorToErrorLogs } from 'src/base/node/logging';
import type { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { createAuthenticationToken } from 'src/base/node/tokens';
import type { LoggedInUser, UserLoginCredentials } from '../../common/types';

export async function verifyLoginCredentials(
	usersRepository: UsersRepositoryInterface,
	credentials: UserLoginCredentials
): Promise<LoggedInUser> {
	try {
		const user = await usersRepository.findByEmail(credentials.email);
		const validPassword = await argon.verify(user.password, credentials.password);
		if (!validPassword) throw new Error('Invalid password');
		const token = createAuthenticationToken(user._id);
		return {
			email: user.email,
			name: user.name,
			token,
			id: user._id,
		};
	} catch (error) {
		processErrorToErrorLogs(error);
		throw new Error('Invalid login credentials');
	}
}

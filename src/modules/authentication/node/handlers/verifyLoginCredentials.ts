import { AuthenticationError } from 'apollo-server-micro';
import * as argon from 'argon2';
import { BadRequestError } from 'src/base/common/errors';
import { AuthenticatedUser } from 'src/base/common/types';
import { processRequestError } from 'src/base/node/errorHandling';
import type { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { createAuthenticationToken } from 'src/base/node/tokens';
import type { UserLoginCredentials } from 'src/modules/authentication/common/types';
import { formatDBUserToAuthUserStructure } from 'src/modules/authentication/node/mappers';

export async function verifyLoginCredentials(
	usersRepository: UsersRepositoryInterface,
	credentials: UserLoginCredentials
): Promise<AuthenticatedUser> {
	try {
		const user = await usersRepository.findByEmail(credentials.email);
		const validPassword = await argon.verify(user.password, credentials.password);
		if (!validPassword) throw new BadRequestError('Invalid password');
		const token = createAuthenticationToken(user._id);
		return formatDBUserToAuthUserStructure(user, token);
	} catch (error) {
		processRequestError(error, new AuthenticationError('Invalid login credentials'));
	}
}

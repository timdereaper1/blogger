import { AuthenticationError } from 'apollo-server-micro';
import * as argon from 'argon2';
import { processRequestError } from 'src/base/node/errorHandling';
import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { ResetPasswordCredentials } from 'src/modules/authentication/common/types';

export async function resetUserPassword(
	usersRepository: UsersRepositoryInterface,
	credentials: ResetPasswordCredentials,
	id: string
) {
	try {
		const hashedPassword = await argon.hash(credentials.password);
		await usersRepository.update(id, { password: hashedPassword });
		return {
			message: 'Password has been reset successfully',
			success: true,
		};
	} catch (error) {
		processRequestError(error, new AuthenticationError('Invalid account reset'));
	}
}

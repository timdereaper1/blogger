import * as argon from 'argon2';
import { processRequestError } from 'src/base/node/errorHandling';
import { UsersRepositoryInterface } from 'src/base/node/repositories/usersRepository';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { UserSignUpCredentials } from 'src/modules/authentication/common/types';
import { formatDBUserToAuthUserStructure } from 'src/modules/authentication/node/mappers';

export async function signUpUserAccount(
	usersRepository: UsersRepositoryInterface,
	credentials: UserSignUpCredentials
) {
	try {
		const password = await argon.hash(credentials.password);
		const newUserAccountCredentials = { ...credentials, password };
		const user = await usersRepository.insert(newUserAccountCredentials);
		const token = createAuthenticationToken(user._id);
		return formatDBUserToAuthUserStructure(user, token);
	} catch (error) {
		processRequestError(error);
	}
}

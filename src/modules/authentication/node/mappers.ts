import { DBUser } from 'src/base/node/repositories/types';
import { AuthenticatedUser } from 'src/modules/authentication/common/types';

export function formatDBUserToAuthUserStructure(user: DBUser, token: string): AuthenticatedUser {
	return {
		email: user.email,
		id: user._id,
		name: user.name,
		token,
		privileges: user.privileges,
	};
}

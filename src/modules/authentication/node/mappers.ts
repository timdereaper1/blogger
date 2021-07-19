import { DBUser } from 'src/base/node/repositories/types';
import { LoggedInUser } from 'src/modules/authentication/common/types';

export function formatDBUserToAuthUserStructure(user: DBUser, token: string): LoggedInUser {
	return {
		email: user.email,
		id: user._id,
		name: user.name,
		token,
	};
}

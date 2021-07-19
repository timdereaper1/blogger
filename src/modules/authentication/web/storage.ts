import { storeInLocalStorage } from 'src/base/web/storage';
import { AuthenticatedUser } from 'src/modules/authentication/common/types';

export function storeLoggedInUser(authenticatedUser: AuthenticatedUser) {
	storeInLocalStorage('@blogger/user', authenticatedUser);
}

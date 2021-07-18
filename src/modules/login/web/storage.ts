import { storeInLocalStorage } from 'src/base/web/storage';
import { LoggedInUser } from 'src/modules/login/common/types';

export function storeLoggedInUser(authenticatedUser: LoggedInUser) {
	storeInLocalStorage('user', authenticatedUser);
}

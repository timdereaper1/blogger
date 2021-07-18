import { storeInLocalStorage } from '../../../../base/web/common/storage';
import { LoggedInUser } from '../../common/types';

export function storeLoggedInUser(authenticatedUser: LoggedInUser) {
	storeInLocalStorage('user', authenticatedUser);
}

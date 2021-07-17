import { storeInLocalStorage } from '../../../../base/web/services/storage';
import { LoggedInUser } from '../../common/types';

export function storeLoggedInUser(authenticatedUser: LoggedInUser) {
	storeInLocalStorage('user', authenticatedUser);
}

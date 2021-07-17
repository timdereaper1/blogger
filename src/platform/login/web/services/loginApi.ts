import { ApiRequest } from '../../../../base/common/types';
import type { LoggedInUser, UserLoginCredentials } from '../../common/types';

export async function verifyUserLoginCredentials(
	credentials: UserLoginCredentials
): Promise<ApiRequest<LoggedInUser>> {
	return { data: undefined, error: '' };
}

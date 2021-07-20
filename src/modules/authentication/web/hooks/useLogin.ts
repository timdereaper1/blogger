import { useGraphqlMutation } from 'src/base/web/hooks/useGraphqlMutation';
import type {
	AuthenticatedUser,
	UserLoginCredentials,
} from 'src/modules/authentication/common/types';
import { SIGN_IN_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';

export interface VerifyCredentialsVariables {
	credentials: UserLoginCredentials;
}

export interface VerifyCredentialsMutationResponse {
	verifyCredentials: AuthenticatedUser;
}

export function useLogin() {
	const mutation = useGraphqlMutation<
		VerifyCredentialsMutationResponse,
		VerifyCredentialsVariables
	>(SIGN_IN_ACCOUNT_MUTATION);

	return function login(credentials: UserLoginCredentials) {
		return mutation({ credentials });
	};
}

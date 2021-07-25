import type { AuthenticatedUser } from 'src/base/common/types';
import { useGraphqlMutation } from 'src/base/web/hooks/useGraphqlMutation';
import type { UserSignUpCredentials } from 'src/modules/authentication/common/types';
import { SIGN_UP_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import { UserSignUpCredentialsForm } from 'src/modules/authentication/web/types';

export interface SignUpAccountMutationResponse {
	signUpAccount: AuthenticatedUser;
}

export function useSignUp() {
	const mutation = useGraphqlMutation<SignUpAccountMutationResponse, UserSignUpCredentials>(
		SIGN_UP_ACCOUNT_MUTATION
	);

	return async function signUp({ confirmPassword, ...credentials }: UserSignUpCredentialsForm) {
		return mutation(credentials);
	};
}

type Ig = SignUpAccountMutationResponse[keyof SignUpAccountMutationResponse];

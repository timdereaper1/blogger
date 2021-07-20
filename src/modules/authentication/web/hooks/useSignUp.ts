import { useMutation } from '@apollo/client';
import type {
	AuthenticatedUser,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { SIGN_UP_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import { UserSignUpCredentialsForm } from 'src/modules/authentication/web/types';

export interface SignUpAccountVariables {
	credentials: UserSignUpCredentials;
}

export interface SignUpAccountMutationResponse {
	signUpAccount: AuthenticatedUser | null;
}

export function useSignUp() {
	const [signUpAccount] = useMutation<SignUpAccountMutationResponse, SignUpAccountVariables>(
		SIGN_UP_ACCOUNT_MUTATION
	);

	return async function signUp({ confirmPassword, ...credentials }: UserSignUpCredentialsForm) {
		try {
			const response = await signUpAccount({ variables: { credentials } });
			if (response.errors) throw response.errors;
			return { data: response.data.signUpAccount };
		} catch (error) {
			return { error: error.message };
		}
	};
}
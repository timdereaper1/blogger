import { gql, useMutation } from '@apollo/client';
import { LoggedInUser, UserSignUpCredentials } from 'src/modules/authentication/common/types';
import { UserSignUpCredentialsForm } from 'src/modules/authentication/web/types';

export const SIGN_UP_ACCOUNT_MUTATION = gql`
	mutation signUpAccount($credentials: UserSignUpCredentials!) {
		signUpAccount(credentials: $credentials) {
			id
			name
			email
			token
		}
	}
`;

export interface SignUpAccountVariables {
	credentials: UserSignUpCredentials;
}

export interface SignUpAccountMutationResponse {
	signUpAccount: LoggedInUser | null;
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

import { gql, useMutation } from '@apollo/client';
import type { LoggedInUser, UserLoginCredentials } from 'src/modules/authentication/common/types';

export const USER_LOGIN_MUTATION = gql`
	mutation verifyCredentials($credentials: UserLoginCredentials!) {
		verifyCredentials(credentials: $credentials) {
			id
			name
			email
			token
		}
	}
`;

export interface VerifyCredentialsVariables {
	credentials: UserLoginCredentials;
}

export interface VerifyCredentialsMutationResponse {
	verifyCredentials: LoggedInUser | null;
}

export function useLogin() {
	const [verifyCredentials] = useMutation<
		VerifyCredentialsMutationResponse,
		VerifyCredentialsVariables
	>(USER_LOGIN_MUTATION);

	async function login(credentials: UserLoginCredentials) {
		try {
			const { data, errors } = await verifyCredentials({
				variables: { credentials },
			});
			if (errors) throw errors;
			return { data: data.verifyCredentials };
		} catch (error) {
			return { error: error.message };
		}
	}

	return login;
}

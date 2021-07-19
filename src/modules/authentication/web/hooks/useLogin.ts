import { gql, useMutation } from '@apollo/client';
import type {
	AuthenticatedUser,
	UserLoginCredentials,
} from 'src/modules/authentication/common/types';
import { AUTHENTICATED_USER_FRAGMENT } from 'src/modules/authentication/web/fragments';

export const USER_LOGIN_MUTATION = gql`
	mutation verifyCredentials($credentials: UserLoginCredentials!) {
		verifyCredentials(credentials: $credentials) {
			...AuthenticatedUser
		}
	}

	${AUTHENTICATED_USER_FRAGMENT}
`;

export interface VerifyCredentialsVariables {
	credentials: UserLoginCredentials;
}

export interface VerifyCredentialsMutationResponse {
	verifyCredentials: AuthenticatedUser | null;
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

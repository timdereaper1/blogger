import { gql, useMutation } from '@apollo/client';
import type { LoggedInUser, UserLoginCredentials } from '../../../common/types';

const USER_LOGIN_MUTATION = gql`
	mutation verifyCredentials($credentials: UserLoginCredentials!) {
		verifyCredentials(credentials: $credentials) {
			id
			name
			email
			token
		}
	}
`;

interface VerifyCredentialsVariables {
	credentials: UserLoginCredentials;
}

interface VerifyCredentialsMutationResponse {
	verifyCredentials: LoggedInUser | null;
}

export function useLogin() {
	const [verifyCredentials] = useMutation<
		VerifyCredentialsMutationResponse,
		VerifyCredentialsVariables
	>(USER_LOGIN_MUTATION);

	async function login(credentials: UserLoginCredentials) {
		const { data, errors } = await verifyCredentials({
			variables: { credentials },
		});
		return { error: errors?.[0].message, data: data?.verifyCredentials };
	}

	return login;
}

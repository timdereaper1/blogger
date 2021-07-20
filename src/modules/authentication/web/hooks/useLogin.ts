import { useMutation } from '@apollo/client';
import type {
	AuthenticatedUser,
	UserLoginCredentials,
} from 'src/modules/authentication/common/types';
import { SIGN_IN_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';

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
	>(SIGN_IN_ACCOUNT_MUTATION);

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

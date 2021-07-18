import { gql } from '@apollo/client';

export const USER_LOGIN_MUTATION = gql`
	mutation verifyCredentialsMutation($credentials: UserLoginCredentials) {
		verifyCredentials(credentials: $credentials) {
			id
			name
			email
			token
		}
	}
`;

import { gql } from '@apollo/client';

export const AUTHENTICATED_USER_FRAGMENT = gql`
	fragment AuthenticatedUser on User {
		id
		name
		email
		token
		privileges
	}
`;

export const SIGN_UP_ACCOUNT_MUTATION = gql`
	mutation signUpAccount($credentials: UserSignUpCredentials!) {
		signUpAccount(credentials: $credentials) {
			...AuthenticatedUser
		}
	}

	${AUTHENTICATED_USER_FRAGMENT}
`;

export const SIGN_IN_ACCOUNT_MUTATION = gql`
	mutation verifyCredentials($credentials: UserLoginCredentials!) {
		verifyCredentials(credentials: $credentials) {
			...AuthenticatedUser
		}
	}

	${AUTHENTICATED_USER_FRAGMENT}
`;

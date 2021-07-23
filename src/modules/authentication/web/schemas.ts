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
	mutation signUpAccount($data: UserSignUpCredentials!) {
		signUpAccount(data: $data) {
			...AuthenticatedUser
		}
	}

	${AUTHENTICATED_USER_FRAGMENT}
`;

export const SIGN_IN_ACCOUNT_MUTATION = gql`
	mutation verifyCredentials($data: UserLoginCredentials!) {
		verifyCredentials(data: $data) {
			...AuthenticatedUser
		}
	}

	${AUTHENTICATED_USER_FRAGMENT}
`;

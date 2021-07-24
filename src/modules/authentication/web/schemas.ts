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

export const VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION = gql`
	mutation verifyAndSendPasswordResetEmail($data: UserPasswordResetCredentials!) {
		verifyAndSendPasswordResetEmail(data: $data) {
			message
			success
		}
	}
`;

export const RESET_USER_PASSWORD_MUTATION = gql`
	mutation resetUserPassword($data: ResetPasswordCredentials!) {
		resetUserPassword(data: $data) {
			message
			success
		}
	}
`;

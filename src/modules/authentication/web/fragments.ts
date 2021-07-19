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

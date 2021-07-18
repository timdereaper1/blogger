import { gql } from 'apollo-server-micro';

export const LOGIN_GRAPHQL_SCHEMA = gql`
	type UserLoginCredentials {
		email: String!
		password: String!
	}

	type Mutation {
		verifyCredentials(credentials: UserLoginCredentials): User
	}
`;

import { gql } from 'apollo-server-micro';

export const LOGIN_GRAPHQL_SCHEMA = gql`
	type User {
		id: String!
		name: String!
		email: String!
		token: String
	}

	input UserLoginCredentials {
		email: String!
		password: String!
	}

	type Query {
		hello: String
	}

	type Mutation {
		verifyCredentials(credentials: UserLoginCredentials): User
	}
`;

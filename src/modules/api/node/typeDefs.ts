import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
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

	input UserSignUpCredentials {
		password: String!
		email: String!
		name: String!
	}

	type Query {
		hello: String
	}

	type Mutation {
		verifyCredentials(credentials: UserLoginCredentials!): User
		signUpAccount(credentials: UserSignUpCredentials!): User
	}
`;

import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
	type User {
		id: String!
		name: String!
		email: String!
		token: String
		privileges: [String!]!
	}

	type Success {
		message: String!
		success: Boolean!
	}

	input UserLoginCredentials {
		email: String!
		password: String!
	}

	input UserSignUpCredentials {
		password: String!
		email: String!
		name: String!
		privileges: [String!]!
	}

	input UserPasswordResetCredentials {
		email: String!
	}

	type Query {
		hello: String
	}

	type Mutation {
		verifyCredentials(data: UserLoginCredentials!): User
		signUpAccount(data: UserSignUpCredentials!): User
		verifyAndSendPasswordResetEmail(data: UserPasswordResetCredentials!): Success
	}
`;

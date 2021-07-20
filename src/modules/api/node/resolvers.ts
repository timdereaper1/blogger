import {
	signUpAccountMutation,
	verifyLoginCredentialsMutation,
} from 'src/modules/authentication/node/loginGraphQLResolver';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: {
		verifyCredentials: verifyLoginCredentialsMutation,
		signUpAccount: signUpAccountMutation,
	},
};

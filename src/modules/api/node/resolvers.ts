import {
	signUpAccountMutation,
	verifyAndSendPasswordResetEmailMutation,
	verifyLoginCredentialsMutation,
} from 'src/modules/authentication/node/authenticationResolvers';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: {
		verifyCredentials: verifyLoginCredentialsMutation,
		signUpAccount: signUpAccountMutation,
		verifyAndSendPasswordResetEmail: verifyAndSendPasswordResetEmailMutation,
	},
};

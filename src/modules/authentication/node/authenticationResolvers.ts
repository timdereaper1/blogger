import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	ResetPasswordCredentials,
	UserLoginCredentials,
	UserPasswordResetCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { resetUserPassword } from './handlers/resetUserPassword';
import { signUpUserAccount } from './handlers/signUpUserAccount';
import { verifyAndSendPasswordResetEmail } from './handlers/verifyAndSendPasswordResetEmail';
import { verifyLoginCredentials } from './handlers/verifyLoginCredentials';

export function verifyLoginCredentialsMutation(
	_parent: unknown,
	args: { data: UserLoginCredentials },
	context: GraphQLContext
) {
	return verifyLoginCredentials(context.dataSources.users, args.data);
}

export function signUpAccountMutation(
	_parent: unknown,
	args: { data: UserSignUpCredentials },
	context: GraphQLContext
) {
	return signUpUserAccount(context.dataSources.users, args.data);
}

export function verifyAndSendPasswordResetEmailMutation(
	_parent: unknown,
	args: { data: UserPasswordResetCredentials },
	context: GraphQLContext
) {
	return verifyAndSendPasswordResetEmail(context.dataSources.users, args.data);
}

export function resetUserPasswordMutation(
	_parent: unknown,
	args: { data: ResetPasswordCredentials },
	context: GraphQLContext
) {
	return resetUserPassword(context.dataSources.users, args.data, context.user.id);
}

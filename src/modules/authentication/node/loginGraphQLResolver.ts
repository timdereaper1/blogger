import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	UserLoginCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { signUpUserAccount } from './handlers/signUpUserAccount';
import { verifyLoginCredentials } from './handlers/verifyLoginCredentials';

export function verifyLoginCredentialsMutation(
	_parent: unknown,
	args: UserLoginCredentials,
	context: GraphQLContext
) {
	return verifyLoginCredentials(context.sources.users, args);
}

export function signUpAccountMutation(
	_parent: unknown,
	args: UserSignUpCredentials,
	context: GraphQLContext
) {
	return signUpUserAccount(context.sources.users, args);
}

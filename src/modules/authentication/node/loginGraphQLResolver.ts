import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	UserLoginCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { signUpUserAccount } from './handlers/signUpUserAccount';
import { verifyLoginCredentials } from './handlers/verifyLoginCredentials';

export function verifyLoginCredentialsMutation(
	_parent: unknown,
	args: { credentials: UserLoginCredentials },
	context: GraphQLContext
) {
	return verifyLoginCredentials(context.sources.users, args.credentials);
}

export function signUpAccountMutation(
	_parent: unknown,
	args: { credentials: UserSignUpCredentials },
	context: GraphQLContext
) {
	return signUpUserAccount(context.sources.users, args.credentials);
}

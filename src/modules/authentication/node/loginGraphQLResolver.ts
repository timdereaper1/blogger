import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	UserLoginCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { signUpUserAccount } from './handlers/signUpUserAccount';
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

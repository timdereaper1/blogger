import { GraphQLContext } from 'src/base/node/graphqlContext';
import { UserLoginCredentials } from 'src/modules/authentication/common/types';
import { verifyLoginCredentials } from './handlers/verifyLoginCredentials';

export function verifyLoginCredentialsMutation(
	_parent: unknown,
	args: UserLoginCredentials,
	context: GraphQLContext
) {
	return verifyLoginCredentials(context.sources.users, args);
}

export const loginGraphQLMutationResolvers = {
	verifyCredentials: verifyLoginCredentialsMutation,
};

import { GraphQLContext } from '../../../base/node/graphqlContext';
import { UserLoginCredentials } from '../common/types';
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

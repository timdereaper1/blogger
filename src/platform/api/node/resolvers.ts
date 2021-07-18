import { loginGraphQLMutationResolvers } from '../../login/node/loginGraphQLResolver';

export const resolvers = {
	Query: {},
	Mutation: Object.assign({}, loginGraphQLMutationResolvers),
};

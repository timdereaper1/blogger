import { loginGraphQLMutationResolvers } from '../../login/node/loginGraphQLResolver';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: Object.assign({}, loginGraphQLMutationResolvers),
};

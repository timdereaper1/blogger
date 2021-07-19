import { loginGraphQLMutationResolvers } from 'src/modules/authentication/node/loginGraphQLResolver';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: Object.assign({}, loginGraphQLMutationResolvers),
};

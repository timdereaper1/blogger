import { loginGraphQLMutationResolvers } from 'src/platform/login/node/loginGraphQLResolver';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: Object.assign({}, loginGraphQLMutationResolvers),
};

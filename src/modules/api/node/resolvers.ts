import { loginGraphQLMutationResolvers } from 'src/modules/login/node/loginGraphQLResolver';

export const resolvers = {
	Query: {
		hello() {
			return 'Hello world';
		},
	},
	Mutation: Object.assign({}, loginGraphQLMutationResolvers),
};

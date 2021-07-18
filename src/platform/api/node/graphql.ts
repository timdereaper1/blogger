import { ApolloServer } from 'apollo-server-micro';
import mongoose from 'mongoose';
import { DataSources } from '../../../base/node/dataSources';
import { LOGIN_GRAPHQL_SCHEMA } from '../../login/node/loginSchema';
import { resolvers } from './resolvers';

export function createGraphqlServerEndpoint() {
	const server = new ApolloServer({
		typeDefs: [LOGIN_GRAPHQL_SCHEMA],
		resolvers,
		context: async () => {
			const connection = await mongoose.connect(process.env.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			const sources = DataSources(connection);
			return { sources };
		},
	});

	return server;
}

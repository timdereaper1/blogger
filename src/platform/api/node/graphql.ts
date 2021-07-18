import { ApolloServer } from 'apollo-server-micro';
import { createDatabaseConnection } from '../../../base/node/connectDB';
import { DataSources } from '../../../base/node/dataSources';
import { LOGIN_GRAPHQL_SCHEMA } from '../../login/node/loginSchema';
import { resolvers } from './resolvers';

export function createGraphqlServerEndpoint() {
	const server = new ApolloServer({
		typeDefs: [LOGIN_GRAPHQL_SCHEMA],
		resolvers,
		context: async () => {
			const client = await createDatabaseConnection();
			const db = client.db('blogger');
			const sources = DataSources(db);
			return { sources };
		},
	});

	return server;
}

import { ApolloServer } from 'apollo-server-micro';
import { createDatabaseConnection } from 'src/base/node/connectDB';
import { DataSources } from 'src/base/node/dataSources';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

export function createGraphqlServerEndpoint() {
	const server = new ApolloServer({
		typeDefs,
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

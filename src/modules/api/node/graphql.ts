import { ApolloServer } from 'apollo-server-micro';
import { createDatabaseConnection, getDatabaseConfig } from 'src/base/node/connectDB';
import { DataSources } from 'src/base/node/dataSources';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

export async function createGraphqlServerEndpoint() {
	const client = await createDatabaseConnection();
	const config = getDatabaseConfig();
	const db = client.db(config.database);
	const sources = DataSources(db);

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: (): any => sources,
	});

	return server;
}

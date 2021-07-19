import { createGraphqlServerEndpoint } from 'src/modules/api/node/graphql';

const server = createGraphqlServerEndpoint();

export const config = {
	api: {
		bodyParser: false,
	},
};

export default server.createHandler({ path: '/api/graphql' });

import { NextApiRequest, NextApiResponse } from 'next';
import { createGraphqlServerEndpoint } from 'src/modules/api/node/graphql';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handleNextJSApiRequest(req: NextApiRequest, res: NextApiResponse) {
	const server = await createGraphqlServerEndpoint();
	const graphqlHandler = server.createHandler({ path: '/api/graphql' });
	return graphqlHandler(req, res);
}

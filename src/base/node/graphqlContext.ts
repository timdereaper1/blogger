import { IncomingMessage } from 'http';
import { DataSourcesInterface } from './dataSources';
import { getAuthenticatedUserIdInToken } from './tokens';

export interface GraphQLContext {
	dataSources: DataSourcesInterface;
	user: { id: string | null };
}

export function getGraphqlContext(args: {
	req: IncomingMessage;
}): Omit<GraphQLContext, 'dataSources'> {
	const { authorization } = args.req.headers;
	const token = authorization ? authorization.split(' ')[1] : '';
	const id = getAuthenticatedUserIdInToken(token);
	return { user: { id } };
}

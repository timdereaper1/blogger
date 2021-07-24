import { DataSourcesInterface } from './dataSources';

export interface GraphQLContext {
	dataSources: DataSourcesInterface;
	user: { id: string };
}

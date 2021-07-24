import { ApolloServer } from 'apollo-server-micro';
import { Collection, Db } from 'mongodb';
import { DataSources } from 'src/base/node/dataSources';
import { getAuthenticatedUserIdInToken } from 'src/base/node/tokens';
import { resolvers } from 'src/modules/api/node/resolvers';
import { typeDefs } from 'src/modules/api/node/typeDefs';
import { RESET_USER_PASSWORD_MUTATION } from 'src/modules/authentication/web/schemas';
import { authToken } from 'tests/fixtures/token';
import { getDatabaseUserFixture } from 'tests/fixtures/users';

jest.mock('src/base/node/tokens');
jest.mock('src/base/node/logging');

describe('graphql: reset password', () => {
	const collection: Partial<Record<keyof Collection, jest.Mock>> = {
		findOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
	};

	const db: Partial<Record<keyof Db, jest.Mock>> = {
		collection: jest.fn().mockReturnValue(collection),
	};

	const sources = DataSources(db as any);

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: (): any => sources,
		context: () => ({ user: { id: getAuthenticatedUserIdInToken(authToken) } }),
	});

	it('should change the user password', async () => {
		const user = await getDatabaseUserFixture();
		collection.findOneAndUpdate.mockResolvedValueOnce({ value: user });
		const response = await server.executeOperation({
			query: RESET_USER_PASSWORD_MUTATION,
			variables: { data: { password: '12345678' } },
		});
		expect(response).toMatchSnapshot();
	});

	it('should throw an error if user is not found', async () => {
		collection.findOneAndUpdate.mockRejectedValueOnce(new Error('Record not found'));
		const response = await server.executeOperation({
			query: RESET_USER_PASSWORD_MUTATION,
			variables: { data: { password: '1234578' } },
		});
		expect(response).toMatchSnapshot();
	});
});

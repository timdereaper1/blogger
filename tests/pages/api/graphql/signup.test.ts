import { ApolloServer } from 'apollo-server-micro';
import { Collection, Db } from 'mongodb';
import { DataSources } from 'src/base/node/dataSources';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { resolvers } from 'src/modules/api/node/resolvers';
import { typeDefs } from 'src/modules/api/node/typeDefs';
import { SIGN_UP_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import { authToken } from 'tests/fixtures/token';
import { getDatabaseUserFixture } from 'tests/fixtures/users';

jest.mock('src/base/node/services/mailing');
jest.mock('src/base/node/tokens');

const mockedToken = createAuthenticationToken as jest.MockedFunction<
	typeof createAuthenticationToken
>;

describe('graphql: sign up', () => {
	const collection: Partial<Record<keyof Collection, jest.Mock>> = {
		findOne: jest.fn(),
		insertOne: jest.fn(),
	};

	const db: Partial<Record<keyof Db, jest.Mock>> = {
		collection: jest.fn().mockReturnValue(collection),
	};

	const sources = DataSources(db as any);

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: (): any => sources,
	});

	it('should create a new account when user is signing up', async () => {
		const user = await getDatabaseUserFixture();
		mockedToken.mockReturnValueOnce(authToken);
		collection.insertOne.mockResolvedValueOnce({ insertedId: user._id });
		const response = await server.executeOperation({
			query: SIGN_UP_ACCOUNT_MUTATION,
			variables: {
				data: {
					email: user.email,
					name: user.name,
					password: '1234567',
					privileges: ['user'],
				},
			},
		});
		expect(response).toMatchSnapshot();
	});
});

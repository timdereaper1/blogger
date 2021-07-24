import { ApolloServer } from 'apollo-server-micro';
import { Collection, Db } from 'mongodb';
import { DataSources } from 'src/base/node/dataSources';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { resolvers } from 'src/modules/api/node/resolvers';
import { typeDefs } from 'src/modules/api/node/typeDefs';
import { VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION } from 'src/modules/authentication/web/schemas';
import { authToken } from 'tests/fixtures/token';
import { getDatabaseUserFixture } from 'tests/fixtures/users';

jest.mock('src/base/node/services/mailing');
jest.mock('src/base/node/tokens');

const mockedToken = createAuthenticationToken as jest.MockedFunction<
	typeof createAuthenticationToken
>;

describe('graphql: send password reset email', () => {
	const collection: Partial<Record<keyof Collection, jest.Mock>> = {
		findOne: jest.fn(),
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

	it('should send an email to user to reset their password', async () => {
		const user = await getDatabaseUserFixture();
		collection.findOne.mockResolvedValueOnce(user);
		mockedToken.mockReturnValueOnce(authToken);
		const response = await server.executeOperation({
			query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
			variables: { data: { email: 'john.doe@gmail.com' } },
		});
		expect(response).toMatchSnapshot();
	});
});

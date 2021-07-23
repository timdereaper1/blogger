import { ApolloServer } from 'apollo-server-micro';
import * as argon from 'argon2';
import type { DBUser } from 'src/base/node/repositories/types';
import { resolvers } from 'src/modules/api/node/resolvers';
import { typeDefs } from 'src/modules/api/node/typeDefs';
import {
	SIGN_IN_ACCOUNT_MUTATION,
	SIGN_UP_ACCOUNT_MUTATION,
} from 'src/modules/authentication/web/schemas';

describe('graphql', () => {
	const sources = {
		users: {
			findByEmail: jest.fn(),
			insert: jest.fn(),
		},
	};

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		dataSources: (): any => sources,
	});

	const password = '1234567';
	const email = 'john.doe@gmail.com';
	const name = 'John Doe';

	it('should sign in user with correct credentials', async () => {
		const user: DBUser = {
			email,
			_id: '9384dEe38rEgf93f02nGf93',
			name,
			password: await argon.hash(password),
			privileges: ['user'],
		};
		sources.users.findByEmail.mockResolvedValueOnce(user);
		const response = await server.executeOperation({
			query: SIGN_IN_ACCOUNT_MUTATION,
			variables: { data: { email, password } },
		});
		expect(response.data).toBeDefined();
		expect(response.data.verifyCredentials).toBeDefined();
		expect(response.data).toEqual(
			expect.objectContaining({
				verifyCredentials: expect.objectContaining({
					name,
					id: user._id,
					privileges: user.privileges,
					email,
					token: expect.any(String),
				}),
			})
		);
	});

	it('should create a new account when user is signing up', async () => {
		const user: DBUser = {
			email,
			_id: '9384dEe38rEgf93f02nGf93',
			name,
			password: await argon.hash(password),
			privileges: ['user'],
		};
		sources.users.insert.mockResolvedValueOnce(user);
		const response = await server.executeOperation({
			query: SIGN_UP_ACCOUNT_MUTATION,
			variables: { data: { email, name, password, privileges: ['user'] } },
		});
		expect(response.data).toBeDefined();
		expect(response.data.signUpAccount).toBeDefined();
		expect(response.data).toEqual(
			expect.objectContaining({
				signUpAccount: expect.objectContaining({
					name,
					id: user._id,
					privileges: user.privileges,
					email,
					token: expect.any(String),
				}),
			})
		);
	});
});

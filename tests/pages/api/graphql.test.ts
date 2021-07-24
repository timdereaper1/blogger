import { ApolloServer } from 'apollo-server-micro';
import * as argon from 'argon2';
import type { DBUser } from 'src/base/node/repositories/types';
import { createAuthenticationToken } from 'src/base/node/tokens';
import { resolvers } from 'src/modules/api/node/resolvers';
import { typeDefs } from 'src/modules/api/node/typeDefs';
import {
	SIGN_IN_ACCOUNT_MUTATION,
	SIGN_UP_ACCOUNT_MUTATION,
	VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
} from 'src/modules/authentication/web/schemas';

jest.mock('src/base/node/services/mailing');
jest.mock('src/base/node/tokens');
const mockedToken = createAuthenticationToken as jest.MockedFunction<
	typeof createAuthenticationToken
>;

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
	const token =
		'eyJhbGciOiJIUzI1NiJ9.OTM4NGRFZTM4ckVnZjkzZjAybkdmOTM.P2UQL5NOeeRzWqFUk8SggYtAvMi73wmsh3DGUzJuAdg';

	async function getDBUser(): Promise<DBUser> {
		return {
			email,
			_id: '9384dEe38rEgf93f02nGf93',
			name,
			password: await argon.hash(password),
			privileges: ['user'],
		};
	}

	describe('sign in', () => {
		it('should sign in user with correct credentials', async () => {
			const user = await getDBUser();
			sources.users.findByEmail.mockResolvedValueOnce(user);
			mockedToken.mockReturnValueOnce(token);
			const response = await server.executeOperation({
				query: SIGN_IN_ACCOUNT_MUTATION,
				variables: { data: { email, password } },
			});
			expect(response).toMatchSnapshot();
		});
	});

	describe('sign up', () => {
		it('should create a new account when user is signing up', async () => {
			const user = await getDBUser();
			sources.users.insert.mockResolvedValueOnce(user);
			mockedToken.mockReturnValueOnce(token);
			const response = await server.executeOperation({
				query: SIGN_UP_ACCOUNT_MUTATION,
				variables: { data: { email, name, password, privileges: ['user'] } },
			});
			expect(response).toMatchSnapshot();
		});
	});

	describe('send password reset email', () => {
		it('should send an email to user to reset their password', async () => {
			const user = await getDBUser();
			sources.users.findByEmail.mockResolvedValueOnce(user);
			const response = await server.executeOperation({
				query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
				variables: { data: { email } },
			});
			expect(response).toMatchSnapshot();
		});
	});
});

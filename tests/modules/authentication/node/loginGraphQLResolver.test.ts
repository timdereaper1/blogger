import faker from 'faker';
import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	UserLoginCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import { signUpUserAccount } from 'src/modules/authentication/node/handlers/signUpUserAccount';
import { verifyLoginCredentials } from 'src/modules/authentication/node/handlers/verifyLoginCredentials';
import {
	signUpAccountMutation,
	verifyLoginCredentialsMutation,
} from 'src/modules/authentication/node/loginGraphQLResolver';

jest.mock('src/modules/authentication/node/handlers/verifyLoginCredentials');
jest.mock('src/modules/authentication/node/handlers/signUpUserAccount');

const context: GraphQLContext = {
	sources: {
		users: {
			findByEmail: jest.fn(),
			insert: jest.fn(),
		},
	},
};

describe('verifyCredentials', () => {
	it('should correctly call verifyLoginCredentials handler', async () => {
		const credentials: UserLoginCredentials = {
			email: faker.internet.email(),
			password: faker.internet.password(),
		};
		await verifyLoginCredentialsMutation(undefined, credentials, context);
		expect(verifyLoginCredentials).toHaveBeenCalledWith(context.sources.users, credentials);
	});
});

describe('signUpAccountMutation', () => {
	it('should correctly call signUpUserAccount handler', async () => {
		const credentials: UserSignUpCredentials = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.name.findName(),
		};
		await signUpAccountMutation(undefined, credentials, context);
		expect(signUpUserAccount).toHaveBeenCalledWith(context.sources.users, credentials);
	});
});

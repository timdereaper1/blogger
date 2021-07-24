import faker from 'faker';
import { GraphQLContext } from 'src/base/node/graphqlContext';
import {
	UserLoginCredentials,
	UserPasswordResetCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import {
	signUpAccountMutation,
	verifyAndSendPasswordResetEmailMutation,
	verifyLoginCredentialsMutation,
} from 'src/modules/authentication/node/authenticationResolvers';
import { signUpUserAccount } from 'src/modules/authentication/node/handlers/signUpUserAccount';
import { verifyAndSendPasswordResetEmail } from 'src/modules/authentication/node/handlers/verifyAndSendPasswordResetEmail';
import { verifyLoginCredentials } from 'src/modules/authentication/node/handlers/verifyLoginCredentials';

jest.mock('src/modules/authentication/node/handlers/verifyLoginCredentials');
jest.mock('src/modules/authentication/node/handlers/signUpUserAccount');
jest.mock('src/modules/authentication/node/handlers/verifyAndSendPasswordResetEmail');

const context: GraphQLContext = {
	dataSources: {
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
		await verifyLoginCredentialsMutation(undefined, { data: credentials }, context);
		expect(verifyLoginCredentials).toHaveBeenCalledWith(context.dataSources.users, credentials);
	});
});

describe('signUpAccountMutation', () => {
	it('should correctly call signUpUserAccount handler', async () => {
		const credentials: UserSignUpCredentials = {
			email: faker.internet.email(),
			password: faker.internet.password(),
			name: faker.name.findName(),
			privileges: ['user'],
		};
		await signUpAccountMutation(undefined, { data: credentials }, context);
		expect(signUpUserAccount).toHaveBeenCalledWith(context.dataSources.users, credentials);
	});
});

describe('verifyAndSendPasswordResetEmailMutation', () => {
	it('should call verifyAndSendPasswordResetEmail handler with user credentials', async () => {
		const credentials: UserPasswordResetCredentials = { email: faker.internet.email() };
		await verifyAndSendPasswordResetEmailMutation(undefined, { data: credentials }, context);
		expect(verifyAndSendPasswordResetEmail).toHaveBeenCalledWith(
			context.dataSources.users,
			credentials
		);
	});
});

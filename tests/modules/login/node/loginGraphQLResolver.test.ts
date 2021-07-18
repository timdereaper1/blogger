import faker from 'faker';
import { GraphQLContext } from 'src/base/node/graphqlContext';
import { UserLoginCredentials } from 'src/modules/login/common/types';
import { verifyLoginCredentials } from 'src/modules/login/node/handlers/verifyLoginCredentials';
import { verifyLoginCredentialsMutation } from 'src/modules/login/node/loginGraphQLResolver';

jest.mock('src/modules/login/node/handlers/verifyLoginCredentials');

type VerifyLoginType = typeof verifyLoginCredentials;
const mockedVerifyLogin = verifyLoginCredentials as jest.MockedFunction<VerifyLoginType>;

describe('verifyCredentials', () => {
	const credentials: UserLoginCredentials = {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};

	const user = {
		id: faker.datatype.uuid(),
		email: credentials.email,
		name: faker.name.findName(),
		token: faker.random.alphaNumeric(),
	};

	const context: GraphQLContext = {
		sources: {
			users: {
				findByEmail: jest.fn().mockResolvedValue(user),
				insert: jest.fn(),
			},
		},
	};

	beforeEach(() => {
		mockedVerifyLogin.mockResolvedValue(user);
	});

	afterEach(() => {
		mockedVerifyLogin.mockReset();
	});

	it('should correctly verify user login credentials', async () => {
		const result = await verifyLoginCredentialsMutation(undefined, credentials, context);
		expect(result).toEqual(user);
	});
});

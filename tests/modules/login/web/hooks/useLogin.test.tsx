/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react-hooks';
import faker from 'faker';
import { GraphQLError } from 'graphql';
import {
	useLogin,
	USER_LOGIN_MUTATION,
	VerifyCredentialsMutationResponse,
} from 'src/modules/login/web/hooks/useLogin';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useLogin', () => {
	const verifyCredentials = {
		email: faker.internet.email(),
		id: faker.datatype.uuid(),
		name: faker.name.findName(),
		token: faker.random.alphaNumeric(),
	};

	const credentials = {
		email: verifyCredentials.email,
		password: faker.internet.password(),
	};

	it('should return the user details for successful login', async () => {
		const { result } = renderMutationHook<VerifyCredentialsMutationResponse>(useLogin, [
			{
				request: { query: USER_LOGIN_MUTATION, variables: { credentials } },
				result: { data: { verifyCredentials } },
			},
		]);
		await act(() => result.current.handleChange(credentials));
		expect(result.current.response).toEqual({
			data: verifyCredentials,
		});
	});

	it('should return the error for unsuccessful login', async () => {
		const { result } = renderMutationHook(useLogin, [
			{
				request: { query: USER_LOGIN_MUTATION, variables: { credentials } },
				result: {
					errors: [new GraphQLError('Invalid login credentials')],
				},
			},
		]);
		await act(() => result.current.handleChange(credentials));
		expect(result.current.response).toEqual({
			error: 'Invalid login credentials',
		});
	});

	it('should return the network error', async () => {
		const { result } = renderMutationHook(useLogin, [
			{
				request: { query: USER_LOGIN_MUTATION, variables: { credentials } },
				error: new Error('Cannot connect to network'),
			},
		]);
		await act(() => result.current.handleChange(credentials));
		expect(result.current.response).toEqual({
			error: 'Cannot connect to network',
		});
	});
});

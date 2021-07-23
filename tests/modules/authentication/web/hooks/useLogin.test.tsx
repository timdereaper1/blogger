/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react-hooks';
import faker from 'faker';
import { GraphQLError } from 'graphql';
import type { AuthenticatedUser } from 'src/modules/authentication/common/types';
import {
	useLogin,
	VerifyCredentialsMutationResponse,
} from 'src/modules/authentication/web/hooks/useLogin';
import { SIGN_IN_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useLogin', () => {
	const verifyCredentials: AuthenticatedUser = {
		email: faker.internet.email(),
		id: faker.datatype.uuid(),
		name: faker.name.findName(),
		token: faker.random.alphaNumeric(),
		privileges: ['super_admin', 'user'],
	};

	const credentials = {
		email: verifyCredentials.email,
		password: faker.internet.password(),
	};

	it('should return the user details for successful login', async () => {
		const { result } = renderMutationHook<VerifyCredentialsMutationResponse>(useLogin, [
			{
				request: { query: SIGN_IN_ACCOUNT_MUTATION, variables: { data: credentials } },
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
				request: { query: SIGN_IN_ACCOUNT_MUTATION, variables: { data: credentials } },
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
				request: { query: SIGN_IN_ACCOUNT_MUTATION, variables: { data: credentials } },
				error: new Error('Cannot connect to network'),
			},
		]);
		await act(() => result.current.handleChange(credentials));
		expect(result.current.response).toEqual({
			error: 'Cannot connect to network',
		});
	});
});

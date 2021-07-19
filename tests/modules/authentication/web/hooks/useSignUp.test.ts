/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react-hooks';
import faker from 'faker';
import { GraphQLError } from 'graphql';
import type {
	AuthenticatedUser,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';
import {
	SignUpAccountMutationResponse,
	SIGN_UP_ACCOUNT_MUTATION,
	useSignUp,
} from 'src/modules/authentication/web/hooks/useSignUp';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useSignUp', () => {
	const credentials: UserSignUpCredentials = {
		email: faker.internet.email(),
		name: faker.name.findName(),
		password: faker.internet.password(),
		privileges: ['user'],
	};

	const signUpAccount: AuthenticatedUser = {
		email: credentials.email,
		name: credentials.name,
		id: faker.datatype.uuid(),
		token: faker.random.alphaNumeric(),
		privileges: ['user', 'super_admin'],
	};

	it('should return data when account is created successfully', async () => {
		const { result } = renderMutationHook<SignUpAccountMutationResponse>(useSignUp, [
			{
				request: { query: SIGN_UP_ACCOUNT_MUTATION, variables: { credentials } },
				result: { data: { signUpAccount } },
			},
		]);
		await act(() =>
			result.current.handleChange({
				...credentials,
				confirmPassword: credentials.password,
			})
		);
		expect(result.current.response).toEqual({
			data: signUpAccount,
		});
	});

	it('should return the error for unsuccessful request', async () => {
		const { result } = renderMutationHook<SignUpAccountMutationResponse>(useSignUp, [
			{
				request: { query: SIGN_UP_ACCOUNT_MUTATION, variables: { credentials } },
				result: {
					errors: [new GraphQLError('Email already exists')],
				},
			},
		]);
		await act(() =>
			result.current.handleChange({
				...credentials,
				confirmPassword: credentials.password,
			})
		);
		expect(result.current.response).toEqual({
			error: 'Email already exists',
		});
	});
});

/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react-hooks';
import faker from 'faker';
import { GraphQLError } from 'graphql';
import { useGraphqlMutation } from 'src/base/web/hooks/useGraphqlMutation';
import { SIGN_IN_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useGraphqlMutation', () => {
	const credentials = {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};
	it('should return the data when request is successful', async () => {
		const { result } = renderMutationHook(
			() => useGraphqlMutation(SIGN_IN_ACCOUNT_MUTATION),
			[
				{
					request: {
						query: SIGN_IN_ACCOUNT_MUTATION,
						variables: { data: credentials },
					},
					result: {
						data: {
							verifyCredentials: {
								email: faker.internet.email(),
								token: 'token',
								name: faker.name.findName(),
								id: faker.datatype.uuid(),
								privileges: ['user'],
							},
						},
					},
				},
			]
		);

		await act(() => result.current.handleChange(credentials));
		expect(result.current.response.data).toBeDefined();
		expect(result.current.response.error).not.toBeDefined();
	});

	it('should return error message if request fails', async () => {
		const { result } = renderMutationHook(
			() => useGraphqlMutation(SIGN_IN_ACCOUNT_MUTATION),
			[
				{
					request: {
						query: SIGN_IN_ACCOUNT_MUTATION,
						variables: { data: credentials },
					},
					result: {
						errors: [new GraphQLError('Request denied')],
					},
				},
			]
		);

		await act(() => result.current.handleChange(credentials));
		expect(result.current.response.error).toBeDefined();
		expect(result.current.response.data).not.toBeDefined();
	});
});

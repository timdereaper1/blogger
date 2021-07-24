/**
 * @jest-environment jsdom
 */
import { act } from '@testing-library/react-hooks';
import faker from 'faker';
import { GraphQLError } from 'graphql';
import {
	useEmailPasswordReset,
	VerifyAndSendPasswordResetEmailResponse,
} from 'src/modules/authentication/web/hooks/useEmailPasswordReset';
import { VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION } from 'src/modules/authentication/web/schemas';
import { renderMutationHook } from 'tests/reactTestUtils';

describe('useEmailPasswordReset', () => {
	const email = faker.internet.email();

	it('should return success true when email is sent', async () => {
		const verifyAndSendPasswordResetEmail = {
			message: 'Email has been sent successfully to John Doe',
			success: true,
		};

		const { result } = renderMutationHook<VerifyAndSendPasswordResetEmailResponse>(
			useEmailPasswordReset,
			[
				{
					request: {
						query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
						variables: { data: { email } },
					},
					result: { data: { verifyAndSendPasswordResetEmail } },
				},
			]
		);
		await act(() => result.current.handleChange({ email }));
		expect(result.current.response).toEqual({ data: verifyAndSendPasswordResetEmail });
	});

	it('should return error', async () => {
		const { result } = renderMutationHook<VerifyAndSendPasswordResetEmailResponse>(
			useEmailPasswordReset,
			[
				{
					request: {
						query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
						variables: { data: { email } },
					},
					result: { errors: [new GraphQLError('Invalid email account')] },
				},
			]
		);
		await act(() => result.current.handleChange({ email }));
		expect(result.current.response).toEqual({ error: 'Invalid email account' });
	});
});

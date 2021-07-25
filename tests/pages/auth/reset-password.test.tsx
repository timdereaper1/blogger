/**
 * @jest-environment jsdom
 */
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { useRouter } from 'next/router';
import { RESET_USER_PASSWORD_MUTATION } from 'src/modules/authentication/web/schemas';
import ResetPasswordPage from 'src/pages/auth/reset-password';
import { authToken } from 'tests/fixtures/token';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('reset-password', () => {
	mockedUseRouter.mockReturnValue({
		query: { token: authToken },
	} as any);

	it('should reset the user password', async () => {
		render(
			<MockedProvider
				mocks={[
					{
						request: {
							query: RESET_USER_PASSWORD_MUTATION,
							variables: { data: { password: '1234567' } },
						},
						result: {
							data: {
								resetUserPassword: {
									message: 'Password has been reset successfully',
									success: true,
								},
							},
						},
					},
				]}
				addTypename={false}
			>
				<ResetPasswordPage />
			</MockedProvider>
		);
		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
		await screen.findAllByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
		await waitFor(() => {
			expect(
				screen.getByText(
					'Password has been reset successfully. You can login with your new password'
				)
			).toBeInTheDocument();
		});
	});

	it('should show error when password cannot be reset', async () => {
		render(
			<MockedProvider
				mocks={[
					{
						request: {
							query: RESET_USER_PASSWORD_MUTATION,
							variables: { data: { password: '1234567' } },
						},
						result: {
							errors: [new GraphQLError('Invalid user account')],
						},
					},
				]}
				addTypename={false}
			>
				<ResetPasswordPage />
			</MockedProvider>
		);
		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
		await screen.findAllByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

		await screen.findByRole('alert');
		expect(screen.getByTestId('notification')).toBeInTheDocument();
		expect(screen.getByTestId('notification-content')).toHaveTextContent(
			'Invalid user account'
		);
	});
});

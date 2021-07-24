/**
 * @jest-environment jsdom
 */

import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION } from 'src/modules/authentication/web/schemas';
import ForgottenPasswordPage from 'src/pages/auth/forgotten-password';

describe('forgotten-password', () => {
	it('should email user with password reset link', async () => {
		render(
			<MockedProvider
				addTypename={false}
				mocks={[
					{
						request: {
							query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
							variables: {
								data: {
									email: 'john.doe@gmail.com',
								},
							},
						},
						result: {
							data: {
								verifyAndSendPasswordResetEmail: {
									message: 'An email has been sent to John Doe',
									success: true,
								},
							},
						},
					},
				]}
			>
				<ForgottenPasswordPage />
			</MockedProvider>
		);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
		await screen.findByText(
			'An email has been sent to john.doe@gmail.com to reset the password'
		);
		expect(screen.getByTestId('message-box')).toBeInTheDocument();
	});

	it('should show error when email cannot be sent', async () => {
		render(
			<MockedProvider
				addTypename={false}
				mocks={[
					{
						request: {
							query: VERIFY_AND_SEND_PASSWORD_RESET_EMAIL_MUTATION,
							variables: {
								data: {
									email: 'john.doe@gmail.com',
								},
							},
						},
						result: {
							errors: [new GraphQLError('Invalid email account')],
						},
					},
				]}
			>
				<ForgottenPasswordPage />
			</MockedProvider>
		);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

		await screen.findByRole('alert');
		expect(screen.getByTestId('notification')).toBeInTheDocument();
		expect(screen.getByTestId('notification-content')).toHaveTextContent(
			'Invalid email account'
		);
	});
});

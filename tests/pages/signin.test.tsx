/**
 * @jest-environment jsdom
 */

import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { useRouter } from 'next/router';
import { SIGN_IN_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import Login from 'src/pages/signin';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('signin', () => {
	const push = jest.fn();

	beforeEach(() => {
		mockedUseRouter.mockReturnValue({ push } as any);
	});

	it('should login user with correct credentials', async () => {
		render(
			<MockedProvider
				addTypename={false}
				mocks={[
					{
						request: {
							query: SIGN_IN_ACCOUNT_MUTATION,
							variables: {
								credentials: {
									email: 'john.doe@gmail.com',
									password: '1234567',
								},
							},
						},
						result: {
							data: {
								verifyCredentials: {
									email: 'john.doe@gmail.com',
									name: 'John Doe',
									privileges: ['user'],
									token: '1234567890',
									id: 'ASD4FG23456789HJ5KL',
								},
							},
						},
					},
				]}
			>
				<Login />
			</MockedProvider>
		);

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(push).toHaveBeenCalledWith('/dashboard');
		});
	});

	it('should show the error message', async () => {
		render(
			<MockedProvider
				addTypename={false}
				mocks={[
					{
						request: {
							query: SIGN_IN_ACCOUNT_MUTATION,
							variables: {
								credentials: {
									email: 'john.doe@gmail.com',
									password: '1234567',
								},
							},
						},
						result: {
							errors: [new GraphQLError('Invalid login credentials')],
						},
					},
				]}
			>
				<Login />
			</MockedProvider>
		);

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Login' }));

		await screen.findByRole('alert');
		expect(screen.getByTestId('notification')).toBeInTheDocument();
		expect(screen.getByTestId('notification-content')).toHaveTextContent(
			'Invalid login credentials'
		);
	});
});

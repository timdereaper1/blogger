/**
 * @jest-environment jsdom
 */

import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { useRouter } from 'next/router';
import { SIGN_UP_ACCOUNT_MUTATION } from 'src/modules/authentication/web/schemas';
import SignUp from 'src/pages/auth/signup';

jest.mock('next/router');
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('signup', () => {
	const push = jest.fn();

	beforeEach(() => {
		mockedUseRouter.mockReturnValue({ push } as any);
	});

	it('should move to dashboard page when signup successful', async () => {
		render(
			<MockedProvider
				addTypename={false}
				mocks={[
					{
						request: {
							query: SIGN_UP_ACCOUNT_MUTATION,
							variables: {
								data: {
									name: 'John Doe',
									email: 'john.doe@gmail.com',
									password: '1234567',
									privileges: ['user'],
								},
							},
						},
						result: {
							data: {
								signUpAccount: {
									name: 'John Doe',
									email: 'john.doe@gmail.com',
									token: '1234567890',
									id: 'ASD4FG23456789HJ5KL',
									privileges: ['user'],
								},
							},
						},
					},
				]}
			>
				<SignUp />
			</MockedProvider>
		);

		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
		await screen.findAllByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
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
							query: SIGN_UP_ACCOUNT_MUTATION,
							variables: {
								data: {
									name: 'John Doe',
									email: 'john.doe@gmail.com',
									password: '1234567',
									privileges: ['user'],
								},
							},
						},
						result: {
							errors: [new GraphQLError('Invalid login credentials')],
						},
					},
				]}
			>
				<SignUp />
			</MockedProvider>
		);

		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '1234567');
		await screen.findByDisplayValue('1234567');

		userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
		await screen.findAllByDisplayValue('1234567');

		userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

		await screen.findByRole('alert');
		expect(screen.getByTestId('notification')).toBeInTheDocument();
		expect(screen.getByTestId('notification-content')).toHaveTextContent(
			'Invalid login credentials'
		);
	});
});

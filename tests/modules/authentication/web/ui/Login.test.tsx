/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useLogin } from 'src/modules/authentication/web/hooks/useLogin';
import { storeLoggedInUser } from 'src/modules/authentication/web/storage';
import Login from 'src/modules/authentication/web/ui/Login';

jest.mock('next/router');
jest.mock('src/modules/authentication/web/storage');
jest.mock('src/modules/authentication/web/hooks/useLogin');

const mockedStoreLoggedInUser = storeLoggedInUser as jest.MockedFunction<typeof storeLoggedInUser>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe('Login', () => {
	const mockMutation = jest.fn().mockReturnValue({
		data: {
			name: 'Test Blogger',
			email: 'test@test.com',
			token: 'token',
		},
	});
	const push = jest.fn();

	beforeEach(() => {
		mockedUseLogin.mockReturnValue(mockMutation);
		mockedUseRouter.mockReturnValue({ push } as any);
	});

	afterEach(() => {
		mockedUseLogin.mockReset();
		mockedUseRouter.mockReset();
		mockedStoreLoggedInUser.mockReset();
		push.mockReset();
	});

	it('should render correctly', async () => {
		render(<Login />);
		expect(screen.getByTestId(/title/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
	});

	it('should show/enter the user email', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		await screen.findByDisplayValue('test@test.com');
		expect(screen.getByLabelText(/Email/)).toHaveDisplayValue('test@test.com');
	});

	it('should show/enter the user password', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Password/), '123456');
		await screen.findByDisplayValue('123456');
		expect(screen.getByLabelText(/Password/)).toHaveDisplayValue('123456');
	});

	it('should send user credentials to login endpoint', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		expect(screen.getByLabelText(/Email/)).toHaveDisplayValue('test@test.com');

		userEvent.type(screen.getByLabelText(/Password/), '123456');
		expect(screen.getByLabelText(/Password/)).toHaveDisplayValue('123456');
		await screen.findByDisplayValue('123456');

		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(mockMutation).toHaveBeenCalledWith({
				email: 'test@test.com',
				password: '123456',
			});
		});
	});

	it('should disable login button when form is invalid', async () => {
		render(<Login />);
		expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
	});

	it('should show loading indicator when submitting', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		userEvent.type(screen.getByLabelText(/Password/), '123456');
		await screen.findByDisplayValue('123456');
		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(screen.getByTestId(/loading/)).toBeInTheDocument();
		});
	});

	it('should clear the form when login is successful', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		userEvent.type(screen.getByLabelText(/Password/), '123456');
		await screen.findByDisplayValue('123456');
		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(screen.getByLabelText(/Email/)).toHaveDisplayValue('');
			expect(screen.getByLabelText(/Password/)).toHaveDisplayValue('');
			expect(screen.queryByTestId(/loading/)).not.toBeInTheDocument();
		});
	});

	it('should show the error message for email field', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test');
		fireEvent.blur(screen.getByLabelText(/Email/));
		await screen.findByText('must be a valid email');
		expect(screen.getByTestId(/error-helper/)).toBeInTheDocument();
	});

	it('should show the error message for password field', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Password/), '123');
		fireEvent.blur(screen.getByLabelText(/Password/));
		await screen.findByText('password must not be less than 6 characters');
		expect(screen.getByTestId(/error-helper/)).toBeInTheDocument();
	});

	it('should store user info when logged in successfully', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		await screen.findByDisplayValue('test@test.com');

		userEvent.type(screen.getByLabelText(/Password/), '123456');
		await screen.findByDisplayValue('123456');

		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(mockedStoreLoggedInUser).toHaveBeenCalledTimes(1);
			expect(mockedStoreLoggedInUser).toHaveBeenCalledWith({
				name: 'Test Blogger',
				email: 'test@test.com',
				token: 'token',
			});
		});
	});

	it('should move to the index page when user is successfully logged in', async () => {
		render(<Login />);
		userEvent.type(screen.getByLabelText(/Email/), 'test@test.com');
		userEvent.type(screen.getByLabelText(/Password/), '123456');
		await screen.findByDisplayValue('123456');
		userEvent.click(screen.getByRole('button', { name: 'Login' }));
		await waitFor(() => {
			expect(push).toHaveBeenCalledWith('/dashboard');
		});
	});
});

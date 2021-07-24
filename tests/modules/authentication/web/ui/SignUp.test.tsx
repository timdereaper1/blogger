/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import faker from 'faker';
import { useRouter } from 'next/router';
import type { AuthenticatedUser } from 'src/modules/authentication/common/types';
import { useSignUp } from 'src/modules/authentication/web/hooks/useSignUp';
import { storeLoggedInUser } from 'src/modules/authentication/web/storage';
import SignUp from 'src/modules/authentication/web/ui/SignUp';

jest.mock('next/router');
jest.mock('src/modules/authentication/web/hooks/useSignUp');
jest.mock('src/modules/authentication/web/storage');
const mockedUseSignUp = useSignUp as jest.MockedFunction<typeof useSignUp>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedStoreUser = storeLoggedInUser as jest.MockedFunction<typeof storeLoggedInUser>;

describe('SignUp', () => {
	const responseData: AuthenticatedUser = {
		name: 'John Doe',
		email: 'john.doe@gmail.com',
		token: 'token',
		id: faker.datatype.uuid(),
		privileges: ['super_admin', 'user'],
	};
	const promise = Promise.resolve({ data: responseData });
	let signUpAccount: jest.Mock<Promise<{ data: AuthenticatedUser }>, []>;
	let push: jest.Mock;

	beforeEach(() => {
		signUpAccount = jest.fn(() => promise);
		push = jest.fn();
		mockedUseSignUp.mockReturnValue(signUpAccount);
		mockedUseRouter.mockReturnValue({ push } as any);
	});

	afterEach(() => {
		signUpAccount.mockReset();
		push.mockReset();
		mockedStoreUser.mockReset();
	});

	it('should render correctly', () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Name')).toBeInTheDocument();
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
		expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
	});

	it('should disable sign up button', () => {
		render(<SignUp />);
		expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
	});

	it('should show/enter the user name', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Name')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');
		expect(screen.getByLabelText('Name')).toHaveDisplayValue('John Doe');
	});

	it('should show/enter the user email', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Email')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');
		expect(screen.getByLabelText('Email')).toHaveDisplayValue('john.doe@gmail.com');
	});

	it('should show/enter the password', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Password')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Password'), '123456');
		await screen.findByDisplayValue('123456');
		expect(screen.getByLabelText('Password')).toHaveDisplayValue('123456');
	});

	it('should show/enter the confirm password', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Confirm Password')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Confirm Password'), '123456');
		await screen.findByDisplayValue('123456');
		expect(screen.getByLabelText('Confirm Password')).toHaveDisplayValue('123456');
	});

	it('should show validation error for name', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Name')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Name'), '12');
		fireEvent.blur(screen.getByLabelText('Name'));
		await screen.findByDisplayValue('12');
		await screen.findByTestId(/error-helper/);
		expect(screen.getByTestId(/error-helper/)).toHaveTextContent(
			'name must not be less than 3 characters'
		);
	});

	it('should show validation error for email', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Email')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Email'), '12');
		fireEvent.blur(screen.getByLabelText('Email'));
		await screen.findByDisplayValue('12');
		await screen.findByTestId(/error-helper/);
		expect(screen.getByTestId(/error-helper/)).toHaveTextContent('must be a valid email');
	});

	it('should show validation error for password', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Password')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Password'), '1256');
		fireEvent.blur(screen.getByLabelText('Password'));
		await screen.findByDisplayValue('1256');
		await screen.findByTestId(/error-helper/);
		expect(screen.getByTestId(/error-helper/)).toHaveTextContent(
			'password must not be less than 6 characters'
		);
	});

	it('should show validation error for confirm password', async () => {
		render(<SignUp />);
		expect(screen.getByLabelText('Password')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Password'), '12565783');
		await screen.findByDisplayValue('12565783');

		expect(screen.getByLabelText('Confirm Password')).toHaveDisplayValue('');
		userEvent.type(screen.getByLabelText('Confirm Password'), '783');
		fireEvent.blur(screen.getByLabelText('Confirm Password'));
		await screen.findByDisplayValue('783');

		await screen.findByTestId(/error-helper/);
		expect(screen.getByTestId(/error-helper/)).toHaveTextContent('does not match password');
	});

	it('should enable button when form is valid', async () => {
		render(<SignUp />);
		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '123456');
		await screen.findByDisplayValue('123456');

		userEvent.type(screen.getByLabelText('Confirm Password'), '123456');
		await screen.findAllByDisplayValue('123456');

		expect(screen.getByRole('button', { name: 'Sign Up' })).not.toBeDisabled();
	});

	it('should sign up user with their details', async () => {
		render(<SignUp />);
		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.type(screen.getByLabelText('Password'), '123456');
		await screen.findByDisplayValue('123456');

		userEvent.type(screen.getByLabelText('Confirm Password'), '123456');
		await screen.findAllByDisplayValue('123456');

		userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
		await act(() => promise as any);
		expect(signUpAccount).toHaveBeenCalledWith({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: '123456',
			confirmPassword: '123456',
			privileges: ['user'],
		});
		expect(mockedStoreUser).toHaveBeenCalledWith(responseData);
		expect(push).toHaveBeenCalledWith('/dashboard');
	});

	it('should not call signUpAccount when form is invalid', async () => {
		render(<SignUp />);
		userEvent.type(screen.getByLabelText('Name'), 'John Doe');
		await screen.findByDisplayValue('John Doe');

		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
		expect(signUpAccount).not.toBeCalled();
	});

	it('should show link to sign in page', () => {
		render(<SignUp />);
		expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
			'href',
			'/auth/signin'
		);
	});
});

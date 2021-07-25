/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { storeAuthenticationTokenInStorage } from 'src/base/web/storage';
import { useResetPassword } from 'src/modules/authentication/web/hooks/useResetPassword';
import ResetUserPassword from 'src/modules/authentication/web/ui/ResetUserPassword';
import { authToken } from 'tests/fixtures/token';

jest.mock('src/modules/authentication/web/hooks/useResetPassword');
jest.mock('next/router');
jest.mock('src/base/web/storage');

const mockedUseResetPassword = useResetPassword as jest.MockedFunction<typeof useResetPassword>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ResetUserPassword', () => {
	const mutation = jest.fn().mockResolvedValue({
		data: { message: 'Password has been reset successfully', success: true },
	});
	mockedUseResetPassword.mockReturnValue(mutation);

	describe('no token', () => {
		beforeEach(() => {
			mockedUseRouter.mockReturnValue({ query: {} } as any);
		});

		it('should render correctly', () => {
			render(<ResetUserPassword />);
			expect(screen.getByTestId('title')).toHaveTextContent('Reset Password');
			expect(screen.getByLabelText('Password')).toBeInTheDocument();
			expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
			expect(
				screen.queryByRole('button', { name: 'Reset Password' })
			).not.toBeInTheDocument();
		});

		it('should disable fields', () => {
			render(<ResetUserPassword />);
			expect(screen.getByLabelText('Password')).toBeDisabled();
			expect(screen.getByLabelText('Confirm Password')).toBeDisabled();
		});
	});

	describe('has token', () => {
		beforeEach(() => {
			mockedUseRouter.mockReturnValue({
				query: { token: authToken },
			} as any);
		});

		it('should render correctly', () => {
			render(<ResetUserPassword />);
			expect(screen.getByTestId('title')).toHaveTextContent('Reset Password');
			expect(screen.getByLabelText('Password')).toBeInTheDocument();
			expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
		});

		it('should show/edit user password', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Password'), '1234567');
			await screen.findByDisplayValue('1234567');
			expect(screen.getByLabelText('Password')).toHaveValue('1234567');
		});

		it('should show/edit confirm password', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
			await screen.findByDisplayValue('1234567');
			expect(screen.getByLabelText('Confirm Password')).toHaveValue('1234567');
		});

		it('should disable submit button', () => {
			render(<ResetUserPassword />);
			expect(screen.getByRole('button', { name: 'Reset Password' })).toBeDisabled();
		});

		it('should show the validation error each field when invalid', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Password'), '123');
			fireEvent.blur(screen.getByLabelText('Password'));

			userEvent.type(screen.getByLabelText('Confirm Password'), '3');
			fireEvent.blur(screen.getByLabelText('Confirm Password'));

			await screen.findAllByTestId('error-helper');
			expect(screen.getAllByTestId('error-helper')).toHaveLength(2);
			expect(screen.getAllByTestId('error-helper')[0]).toHaveTextContent(
				'password must not be less than 6 characters'
			);
			expect(screen.getAllByTestId('error-helper')[1]).toHaveTextContent(
				'does not match password'
			);
		});

		it('should enable submit button when form is valid', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Password'), '1234567');
			await screen.findByDisplayValue('1234567');

			userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
			await screen.findAllByDisplayValue('1234567');

			expect(screen.getByRole('button', { name: 'Reset Password' })).not.toBeDisabled();
		});

		it('should submit form with new credentials', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Password'), '1234567');
			await screen.findByDisplayValue('1234567');

			userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
			await screen.findAllByDisplayValue('1234567');

			userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
			await screen.findByRole('progressbar');
			expect(storeAuthenticationTokenInStorage).toHaveBeenCalledWith(authToken);
			expect(mutation).toHaveBeenCalledWith({
				password: '1234567',
				confirmPassword: '1234567',
			});
		});

		it('should show a message to user if password was reset successfully', async () => {
			render(<ResetUserPassword />);
			userEvent.type(screen.getByLabelText('Password'), '1234567');
			await screen.findByDisplayValue('1234567');

			userEvent.type(screen.getByLabelText('Confirm Password'), '1234567');
			await screen.findAllByDisplayValue('1234567');

			userEvent.click(screen.getByRole('button', { name: 'Reset Password' }));
			await screen.findByTestId('message-box');
			expect(screen.getByTestId('message-box')).toHaveTextContent(
				'Password has been reset successfully. You can login with your new password'
			);
			expect(screen.getByLabelText('Confirm Password')).toHaveValue('');
			expect(screen.getByLabelText('Password')).toHaveValue('');
		});
	});
});

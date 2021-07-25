/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEmailPasswordReset } from 'src/modules/authentication/web/hooks/useEmailPasswordReset';
import ForgottenPassword from 'src/modules/authentication/web/ui/ForgottenPassword';

jest.mock('src/modules/authentication/web/hooks/useEmailPasswordReset');

const mockedUseEmailPasswordReset = useEmailPasswordReset as jest.MockedFunction<
	typeof useEmailPasswordReset
>;

describe('ForgottenPassword', () => {
	const mutation = jest
		.fn()
		.mockResolvedValue({ data: { message: 'Email has been sent', success: true } });
	mockedUseEmailPasswordReset.mockReturnValue(mutation);

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('should render correctly', () => {
		render(<ForgottenPassword />);
		expect(screen.getByText('Forgotten Password')).toBeInTheDocument();
		expect(screen.getByTestId('description')).toHaveTextContent(
			'To reset your password, enter your login email and an email will be sent to the address.'
		);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Send Email' })).toBeInTheDocument();
	});

	it('should allow user to enter their email', async () => {
		render(<ForgottenPassword />);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');
		expect(screen.getByLabelText('Email')).toHaveValue('john.doe@gmail.com');
		expect(screen.getByLabelText('Email')).toBeRequired();
	});

	it('should disable submit button', () => {
		render(<ForgottenPassword />);
		expect(screen.getByRole('button', { name: 'Send Email' })).toBeDisabled();
	});

	it('should enable submit button if email is valid', async () => {
		render(<ForgottenPassword />);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');
		expect(screen.getByRole('button', { name: 'Send Email' })).not.toBeDisabled();
	});

	it('should show error if the user does not enter any email', async () => {
		render(<ForgottenPassword />);
		fireEvent.blur(screen.getByLabelText('Email'));
		await screen.findByText('email is required');
		expect(screen.getByTestId('error-helper')).toBeInTheDocument();
	});

	it('should submit form with the email', async () => {
		render(<ForgottenPassword />);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');
		userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
		await screen.findByRole('progressbar');
		await waitFor(() => {
			expect(mutation).toHaveBeenCalled();
			expect(mutation).toHaveBeenCalledWith({ email: 'john.doe@gmail.com' });
		});
	});

	it('should show message to user when email is sent successfully', async () => {
		render(<ForgottenPassword />);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');
		userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
		await screen.findByText(
			'An email has been sent to john.doe@gmail.com to reset the password'
		);
		expect(screen.getByTestId('message-box')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
	});

	it('should enable the resend button after every minute', async () => {
		render(<ForgottenPassword />);
		userEvent.type(screen.getByLabelText('Email'), 'john.doe@gmail.com');
		await screen.findByDisplayValue('john.doe@gmail.com');

		userEvent.click(screen.getByRole('button', { name: 'Send Email' }));

		await screen.findByRole('button', { name: 'Resend' });
		expect(screen.getByRole('button', { name: 'Resend' })).toBeDisabled();

		act(() => jest.runAllTimers() as any);
		expect(screen.getByRole('button', { name: 'Resend' })).not.toBeDisabled();

		userEvent.click(screen.getByRole('button', { name: 'Resend' }));

		await screen.findByText(
			'An email has been sent to john.doe@gmail.com to reset the password'
		);
		expect(mutation).toHaveBeenCalledWith({ email: 'john.doe@gmail.com' });
	});
});

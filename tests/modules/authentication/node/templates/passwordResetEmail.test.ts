import { getPasswordResetEmail } from 'src/modules/authentication/node/templates/passwordResetEmail';

describe('getPasswordResetEmail', () => {
	it('should return an email message with the reset password link included', () => {
		const message = getPasswordResetEmail('John Doe', '123456789012234567890');
		expect(message).toMatchInlineSnapshot(`"<p>Hi John Doe,<br />You requested for a password reset of your account. Click on the button below to proceed to reset your password.<br /><a href=\\"http://localhost:3000/auth/reset-password?token=123456789012234567890\\">Reset Password</a></p>"`);
	});
});

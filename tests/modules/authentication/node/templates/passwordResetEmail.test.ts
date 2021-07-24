import { getPasswordResetEmail } from 'src/modules/authentication/node/templates/passwordResetEmail';

describe('getPasswordResetEmail', () => {
	it('should return an email message with the reset password link included', () => {
		const message = getPasswordResetEmail('John Doe', '123456789012234567890');
		expect(message).toMatchInlineSnapshot(`
"
        <html>
            <head>
                <title>Password Reset</title>
            </head>
            <body>
                <main>
                    <p>Hi John Doe,</p> 
                    <p>You requested for a password reset of your account. Click on the button below to proceed to reset your password.</p>
                    <p>
                        <a href=\\"http://localhost:3000/auth/reset-password?token=123456789012234567890\\">Reset Password</a>
                    </p>
                </main>
            </body>
        </html>
    "
`);
	});
});

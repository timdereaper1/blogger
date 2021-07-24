import { getWebBaseUrl } from 'src/base/node/url';

export function getPasswordResetEmail(name: string, token: string) {
	const url = getWebBaseUrl() + `/auth/reset-password?token=${token}`;
	return `
        <html>
            <head>
                <title>Password Reset</title>
            </head>
            <body>
                <main>
                    <p>Hi ${name},</p> 
                    <p>You requested for a password reset of your account. Click on the button below to proceed to reset your password.</p>
                    <p>
                        <a href="${url}">Reset Password</a>
                    </p>
                </main>
            </body>
        </html>
    `;
}

import { getWebBaseUrl } from 'src/base/node/url';

export function getPasswordResetEmail(name: string, token: string) {
	const url = getWebBaseUrl() + `/auth/reset-password?token=${token}`;
	return `<p>Hi ${name},<br />You requested for a password reset of your account. Click on the button below to proceed to reset your password.<br /><a href="${url}">Reset Password</a></p>`;
}

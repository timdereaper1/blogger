import nodemailer from 'nodemailer';
import { processErrorToErrorLogs } from 'src/base/node/logging';
import { getOAuth2Client } from './oAuth2Client';

export async function sendEmail(to: string, subject: string, message: string) {
	try {
		const transporter = await getEmailTransporter();
		const options = getTransporterEmailOptions(to, subject, message);
		const { response } = await transporter.sendMail(options);
		return response;
	} catch (error) {
		processErrorToErrorLogs(error);
	}
}

export async function getEmailTransporter() {
	const accessToken = await getOAuth2Client().getAccessToken();
	const auth: any = {
		type: 'OAuth2',
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
		accessToken,
	};
	return nodemailer.createTransport({ service: 'gmail', auth });
}

export function getTransporterEmailOptions(to: string, subject: string, message: string) {
	return {
		to,
		from: process.env.MAIL_USER,
		subject,
		html: message,
	};
}

import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, message: string) {
	const transporter = getEmailTransporter();
	const options = getTransporterEmailOptions(to, subject, message);
	const { response } = await transporter.sendMail(options);
	return response;
}

export function getEmailTransporter() {
	const auth: any = {
		type: 'OAuth2',
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
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

import dotenv from 'dotenv';
import faker from 'faker';
import nodemailer from 'nodemailer';
import {
	getEmailTransporter,
	getTransporterEmailOptions,
	sendEmail,
} from 'src/base/node/services/mailing';
import { getOAuth2Client } from 'src/base/node/services/oAuth2Client';

dotenv.config();

jest.mock('nodemailer');
jest.mock('src/base/node/services/oAuth2Client');

const mockedMailer = nodemailer as jest.Mocked<typeof nodemailer>;
const mockedClient = getOAuth2Client as jest.MockedFunction<typeof getOAuth2Client>;

const getAccessToken = jest.fn().mockResolvedValue('1234567890');
mockedClient.mockReturnValue({ getAccessToken } as any);

const to = faker.internet.email();
const subject = faker.random.words();
const message = faker.lorem.paragraph();

describe('getEmailTransporter', () => {
	it('should use the gmail service for emailing', async () => {
		await getEmailTransporter();
		expect(mockedMailer.createTransport).toHaveBeenCalledTimes(1);
		expect(mockedMailer.createTransport).toHaveBeenCalledWith({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASSWORD,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: '1234567890',
			},
		});
	});
});

describe('getTransporterEmailOptions', () => {
	it('should return the messaging options for html', () => {
		const result = getTransporterEmailOptions(to, subject, message);
		expect(result).toEqual({
			html: message,
			subject,
			to,
			from: process.env.MAIL_USER,
		});
	});
});

describe('sendEmail', () => {
	it('should send email to client', async () => {
		const sendMail = jest.fn().mockResolvedValueOnce({ response: 'Successful' });
		const mockedTransporter: any = { sendMail };
		mockedMailer.createTransport.mockReturnValueOnce(mockedTransporter);
		const response = await sendEmail(to, subject, message);
		expect(sendMail).toHaveBeenCalled();
		expect(sendMail).toHaveBeenCalledTimes(1);
		expect(response).toBe('Successful');
	});
});

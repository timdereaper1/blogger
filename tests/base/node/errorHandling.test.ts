import { AuthenticationError } from 'apollo-server-micro';
import { CustomError } from 'src/base/common/errors';
import { processRequestError } from 'src/base/node/errorHandling';
import { processErrorToErrorLogs } from 'src/base/node/logging';

jest.mock('src/base/node/logging');

describe('processRequestError', () => {
	it('should throw message if error is custom', () => {
		const error = new CustomError();
		expect(() => processRequestError(error, 'Invalid request')).toThrow('Invalid request');
	});

	it('should throw error if there is no message', () => {
		const error = new CustomError('Custom error');
		expect(() => processRequestError(error)).toThrow('Custom error');
	});

	it('should throw internal server error is error is not custom', () => {
		const error = new Error();
		expect(() => processRequestError(error)).toThrow('Internal server error');
	});

	it('should log error to error.log file', () => {
		const error = new Error();
		expect(() => processRequestError(error)).toThrow('Internal server error');
		expect(processErrorToErrorLogs).toHaveBeenCalled();
	});

	it('should throw default error if error is custom', () => {
		const error = new CustomError();
		expect(() =>
			processRequestError(error, new AuthenticationError('Invalid login credentials'))
		).toThrow('Invalid login credentials');
	});
});

import { BadRequestError } from 'src/base/common/errors';
import { appendToFile, createDirectory, createFile } from 'src/base/node/files';
import { processErrorToErrorLogs } from 'src/base/node/logging';

jest.mock('src/base/node/files');
const mockedAppendToFile = appendToFile as jest.MockedFunction<typeof appendToFile>;
const mockedCreateDirectory = createDirectory as jest.MockedFunction<typeof createDirectory>;
const mockedCreateFile = createFile as jest.MockedFunction<typeof createFile>;

describe('processErrorToErrorLogs', () => {
	beforeEach(() => {
		mockedCreateDirectory.mockReturnValue('/path/to/log');
		mockedCreateFile.mockReturnValue('/path/to/log/error.log');
	});

	afterEach(() => {
		mockedCreateDirectory.mockReset();
		mockedCreateFile.mockReset();
		mockedAppendToFile.mockReset();
	});

	it('should log error to file', () => {
		processErrorToErrorLogs(new Error('an unknown error occurred'));
		expect(mockedAppendToFile).toHaveBeenCalled();
	});

	it('should not log error if it is a custom error', () => {
		const error = new BadRequestError('Invalid email');
		processErrorToErrorLogs(error);
		expect(mockedAppendToFile).not.toBeCalled();
	});
});

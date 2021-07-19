import fs from 'fs';
import { appendToFile, createDirectory, createFile } from 'src/base/node/files';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

beforeEach(() => {
	mockedFs.existsSync.mockReturnValue(false);
});

afterEach(() => {
	mockedFs.mkdirSync.mockReset();
});

describe('createDirectory', () => {
	it('should create directory if it does not exist', () => {
		createDirectory('log');
		expect(mockedFs.mkdirSync).toHaveBeenCalledTimes(1);
	});

	it('should not create directory if it already exists', () => {
		mockedFs.existsSync.mockReturnValue(true);
		createDirectory('log');
		expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
	});

	it('should return the absolute path of the directory', () => {
		const path = createDirectory('log');
		expect(path).toMatch(/log/g);
	});
});

describe('createFile', () => {
	it('should create a file if it does not exist', () => {
		createFile('/path/to/error.log');
		expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(1);
	});

	it('should return the file path', () => {
		const path = createFile('/path/to/error.log');
		expect(path).toMatch(/error\.log/g);
	});
});

describe('appendToFile', () => {
	it('should add data to the file', () => {
		const result = appendToFile('/path/to/file', '1234567890');
		expect(result).toBeTruthy();
		expect(mockedFs.appendFileSync).toHaveBeenCalledTimes(1);
	});
});

import path from 'path';
import { appendToFile, createDirectory, createFile } from './files';

export function processErrorToErrorLogs(error: any) {
	if (error.isCustom) return;
	const directoryPath = createDirectory('/logs');
	const file = createFile(path.join(directoryPath, 'error.log'));
	appendToFile(
		file,
		`=============================================
        error: ${error.name}
        date: ${new Date().toDateString()}
        message: ${error.message}
        stack: ${error.stack}\n`
	);
}

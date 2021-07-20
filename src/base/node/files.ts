import fs from 'fs';
import path from 'path';

export function createDirectory(directoryPath: string) {
	const fullDirectoryPath = path.join(process.cwd(), directoryPath);
	if (!fs.existsSync(fullDirectoryPath)) fs.mkdirSync(fullDirectoryPath);
	return fullDirectoryPath;
}

export function createFile(filePath: string) {
	if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '');
	return filePath;
}

export function appendToFile(filePath: string, data: string) {
	const file = createFile(filePath);
	fs.appendFileSync(file, data);
	return true;
}

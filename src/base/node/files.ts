import fs from 'fs';
import path from 'path';

export function createDirectory(directoryPath: string) {
	const fullDirectoryPath = path.join(process.cwd(), directoryPath);
	const stats = fs.statSync(fullDirectoryPath);
	if (!stats.isDirectory()) fs.mkdirSync(fullDirectoryPath);
	return fullDirectoryPath;
}

export function createFile(filePath: string) {
	const stats = fs.statSync(filePath);
	if (!stats.isFile()) fs.writeFileSync(filePath, '');
	return filePath;
}

export function appendToFile(filePath: string, data: string) {
	const file = createFile(filePath);
	fs.appendFileSync(file, data);
	return true;
}

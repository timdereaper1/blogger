import { MongoClient } from 'mongodb';

let cached: { conn: MongoClient | null; promise: Promise<MongoClient> | null };

if (!cached) {
	cached = global.mongo = { conn: null, promise: null };
}

const environment = {
	development: {
		database: 'blogger',
		url: process.env.MONGO_URL,
	},
	test: {
		database: 'test_blogger',
		url: process.env.MONGO_URL,
	},
	production: {
		database: 'blogger',
		url: '',
	},
};

export function getDatabaseConfig() {
	const config = environment[process.env.NODE_ENV];
	return config;
}

export async function createDatabaseConnection() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		const config = getDatabaseConfig();
		cached.promise = MongoClient.connect(config.url);
		cached.conn = await cached.promise;
		return cached.conn;
	}
}

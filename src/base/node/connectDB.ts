import { MongoClient } from 'mongodb';

let cached: { conn: MongoClient | null; promise: Promise<MongoClient> | null };

if (!cached) {
	cached = global.mongo = { conn: null, promise: null };
}

export async function createDatabaseConnection() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = MongoClient.connect(process.env.MONGO_URL);
		cached.conn = await cached.promise;
		return cached.conn;
	}
}

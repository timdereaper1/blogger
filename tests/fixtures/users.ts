import * as argon from 'argon2';
import { ObjectId } from 'mongodb';

export async function getDatabaseUserFixture() {
	return {
		password: await argon.hash('1234567'),
		email: 'john.doe@gmail.com',
		name: 'John Doe',
		privileges: ['user'],
		_id: new ObjectId('123456789012'),
	};
}

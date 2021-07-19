import faker from 'faker';
import { DBUser } from 'src/base/node/repositories/types';
import { formatDBUserToAuthUserStructure } from 'src/modules/authentication/node/mappers';

describe('formatDBUserToAuthUserStructure', () => {
	it('should format db user to authenticated user structure', () => {
		const dbUser: DBUser = {
			_id: faker.datatype.uuid(),
			email: faker.internet.email(),
			name: faker.name.findName(),
			password: faker.internet.password(),
			privileges: ['super_admin'],
		};
		const token = faker.random.alphaNumeric();
		const result = formatDBUserToAuthUserStructure(dbUser, token);
		expect(result).toEqual({
			id: dbUser._id,
			email: dbUser.email,
			name: dbUser.name,
			token,
			privileges: ['super_admin'],
		});
	});
});

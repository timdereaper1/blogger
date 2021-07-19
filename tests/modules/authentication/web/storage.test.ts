import faker from 'faker';
import { storeInLocalStorage } from 'src/base/web/storage';
import { AuthenticatedUser } from 'src/modules/authentication/common/types';
import { storeLoggedInUser } from 'src/modules/authentication/web/storage';

jest.mock('src/base/web/storage');

describe('storeLoggedInUser', () => {
	const authenticatedUser: AuthenticatedUser = {
		email: faker.internet.email(),
		id: faker.datatype.uuid(),
		name: faker.name.findName(),
		privileges: ['super_admin', 'user'],
		token: faker.random.alphaNumeric(),
	};

	it('should call storeInLocalStorage with @blogger/user key', () => {
		storeLoggedInUser(authenticatedUser);
		expect(storeInLocalStorage).toHaveBeenCalledWith('@blogger/user', authenticatedUser);
	});
});

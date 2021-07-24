import * as argon from 'argon2';
import faker from 'faker';
import { DBUser } from 'src/base/node/repositories/types';
import { resetUserPassword } from 'src/modules/authentication/node/handlers/resetUserPassword';
import { MockUsersRepository } from 'tests/base/node/repositories/types';

jest.mock('argon2');
jest.mock('src/base/node/logging');

const mockArgon = argon as jest.Mocked<typeof argon>;

describe('resetUserPassword', () => {
	const password = faker.internet.password();
	const id = faker.datatype.uuid();
	const repository: MockUsersRepository = {
		findByEmail: jest.fn(),
		insert: jest.fn(),
		update: jest.fn(),
	};
	const dbUser: DBUser = {
		email: faker.internet.email(),
		password,
		name: faker.name.findName(),
		_id: id,
		privileges: ['user', 'super_admin'],
	};
	const credentials = { password };

	beforeEach(() => {
		repository.update.mockResolvedValueOnce(dbUser);
	});

	it('should reset the user password', async () => {
		mockArgon.hash.mockResolvedValueOnce('1234567890');
		await resetUserPassword(repository, credentials, id);
		expect(repository.update).toHaveBeenCalled();
		expect(repository.update).toHaveBeenCalledWith(id, { password: '1234567890' });
	});

	it('should return a success message when password is reset', async () => {
		const response = await resetUserPassword(repository, credentials, id);
		expect(response).toEqual({
			message: 'Password has been reset successfully',
			success: true,
		});
	});

	it('should throw error if password could not be reset', async () => {
		try {
			repository.update.mockRejectedValueOnce(new Error('Record not found'));
			await resetUserPassword(repository, credentials, id);
		} catch (error) {
			expect(error.message).rejects.toBe('Invalid account reset');
		}
	});
});

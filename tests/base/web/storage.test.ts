/**
 * @jest-environment jsdom
 */

import faker from 'faker';
import { AuthenticatedUser } from 'src/base/common/types';
import {
	getAuthenticatedUserInStorage,
	getAuthenticationTokenInStorage,
	getItemInLocalStorage,
	storeAuthenticatedUserInStorage,
	storeAuthenticationTokenInStorage,
	storeInLocalStorage,
} from 'src/base/web/storage';
import { authToken } from 'tests/fixtures/token';

const authenticatedUser: AuthenticatedUser = {
	email: faker.internet.email(),
	id: faker.datatype.uuid(),
	name: faker.name.findName(),
	privileges: ['super_admin', 'user'],
	token: authToken,
};

describe('storeInLocalStorage', () => {
	it('should store the encoded data in local storage', () => {
		const spy = jest.spyOn(window.localStorage.__proto__, 'setItem');
		storeInLocalStorage('key', { key: 'value' });
		expect(spy).toHaveBeenCalledWith('key', JSON.stringify({ key: 'value' }));
	});
});

describe('getItemInLocalStorage', () => {
	it('should return null if key or data is not found in local storage', () => {
		const result = getItemInLocalStorage('keys');
		expect(result).toBeNull();
	});

	it('should return the parsed data found in local storage', () => {
		storeInLocalStorage('key', { key: 'value' });
		const result = getItemInLocalStorage('key');
		expect(result).toEqual({ key: 'value' });
	});
});

describe('getAuthenticationTokenInStorage', () => {
	it('should return null if user is not found', () => {
		const result = getAuthenticationTokenInStorage();
		expect(result).toBeNull();
	});

	it('should return the token if user exists', () => {
		storeAuthenticatedUserInStorage(authenticatedUser);
		const result = getAuthenticationTokenInStorage();
		expect(result).toBe(authToken);
	});
});

describe('storeAuthenticatedUserInStorage', () => {
	it('should call storeInLocalStorage with @blogger/user key', () => {
		const spy = jest.spyOn(window.localStorage.__proto__, 'setItem');
		storeAuthenticatedUserInStorage(authenticatedUser);
		expect(spy).toHaveBeenCalledWith('@blogger/user', JSON.stringify(authenticatedUser));
	});
});

describe('getAuthenticatedUserInStorage', () => {
	it('should return user stored in local storage', () => {
		const user = getAuthenticatedUserInStorage();
		expect(user).toBeDefined();
	});

	it('should return null if user does not exist', () => {
		localStorage.clear();
		const user = getAuthenticatedUserInStorage();
		expect(user).toBeNull();
	});
});

describe('storeAuthenticationTokenInStorage', () => {
	it('should replace the token in storage', () => {
		storeAuthenticationTokenInStorage('1234567890');
		const result = getAuthenticationTokenInStorage();
		expect(result).toBe('1234567890');
	});

	it('should store the token in storage if user does not exist', () => {
		localStorage.clear();
		storeAuthenticationTokenInStorage('1234567890');
		const result = getAuthenticationTokenInStorage();
		expect(result).toBe('1234567890');
	});
});

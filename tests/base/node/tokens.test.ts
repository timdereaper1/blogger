import {
	createAuthenticationToken,
	createExpiryAuthenticationToken,
	getAuthenticatedUserIdInToken,
	verifyAuthenticationToken,
} from 'src/base/node/tokens';
import { authToken, expiredToken } from 'tests/fixtures/token';

describe('createAuthenticationToken', () => {
	it('should return a unique string', () => {
		const result = createAuthenticationToken('test-sign-token');
		expect(result).not.toBe('');
		expect(result).not.toBe('test-sign-token');
	});
});

describe('createExpiryAuthenticationToken', () => {
	it('should return a unique token that expires after 1hr', () => {
		const token = createExpiryAuthenticationToken('test-sign-token');
		expect(token).not.toBe('');
		expect(token).not.toBeNull();
		expect(token).not.toBe('test-sign-token');
	});

	it('should create token from the expiresIn param', () => {
		const token = createExpiryAuthenticationToken('test-sign-token', 60);
		expect(token).not.toBe('');
		expect(token).not.toBeNull();
		expect(token).not.toBe('test-sign-token');
	});
});

describe('getAuthenticatedUserIdInToken', () => {
	it('should return the user id', () => {
		const id = getAuthenticatedUserIdInToken(authToken);
		expect(id).not.toBeUndefined();
	});

	it('should return null when token is invalid', () => {
		const id = getAuthenticatedUserIdInToken('');
		expect(id).toBeNull();
	});

	it('should return null if there is no token', () => {
		const id = getAuthenticatedUserIdInToken(undefined as any);
		expect(id).toBeNull();
	});

	it('should return null if token is expired', () => {
		const result = getAuthenticatedUserIdInToken(expiredToken);
		expect(result).toBeNull();
	});
});

describe('verifyAuthenticationToken', () => {
	it('should return true if token is valid', () => {
		const result = verifyAuthenticationToken(authToken);
		expect(result).toBeTruthy();
	});

	it('should return false if token is invalid', () => {
		const result = verifyAuthenticationToken(expiredToken);
		expect(result).toBeFalsy();
	});
});

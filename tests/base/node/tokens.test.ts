import { createAuthenticationToken } from '../../../src/base/node/tokens';

describe('createAuthenticationToken', () => {
	it('should return a unique string', () => {
		const result = createAuthenticationToken('test-sign-token');
		expect(result).not.toBe('');
		expect(result).not.toBe('test-sign-token');
	});
});

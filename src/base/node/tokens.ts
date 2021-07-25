import { decode, sign, verify } from 'jsonwebtoken';

export function createAuthenticationToken(args: string) {
	return sign(args, 'secret-key-used-for-tokens');
}

export function getAuthenticatedUserIdInToken(token: string): string | null {
	const isTokenValid = verifyAuthenticationToken(token);
	if (!isTokenValid) return null;
	const decoded = decode(token);
	if (!decoded) return null;
	if (typeof decoded === 'object' && 'id' in decoded) return decoded.id;
	return decoded as any;
}

export function createExpiryAuthenticationToken(args: string, expiresIn: string | number = '1h') {
	return sign({ id: args }, 'secret-key-used-for-tokens', {
		expiresIn,
	});
}

export function verifyAuthenticationToken(token: string) {
	try {
		verify(token, 'secret-key-used-for-tokens');
		return true;
	} catch (error) {
		return false;
	}
}

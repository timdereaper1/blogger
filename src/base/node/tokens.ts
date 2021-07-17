import { sign } from 'jsonwebtoken';

export function createAuthenticationToken(args: string) {
	return sign(args, 'secret-key-used-for-tokens');
}

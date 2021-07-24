import { decode, sign } from 'jsonwebtoken';

export function createAuthenticationToken(args: string) {
	return sign(args, 'secret-key-used-for-tokens');
}

export function getDataFromToken<TData = any>(token: string): TData {
	return decode(token) as any;
}

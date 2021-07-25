import { AuthenticatedUser } from 'src/base/common/types';

const USER_KEY = '@blogger/user';

export function storeInLocalStorage(key: string, data: unknown): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(data));
}

export function getItemInLocalStorage<T>(key: string): T | null {
	if (typeof localStorage === 'undefined') return null;
	const item = localStorage.getItem(key);
	return !item ? null : JSON.parse(item);
}

export function getAuthenticationTokenInStorage() {
	const user = getItemInLocalStorage<AuthenticatedUser>(USER_KEY);
	return !user ? null : user.token;
}

export function storeAuthenticatedUserInStorage(authenticatedUser: AuthenticatedUser) {
	storeInLocalStorage(USER_KEY, authenticatedUser);
}

export function storeAuthenticationTokenInStorage(token: string) {
	const user = getAuthenticatedUserInStorage();
	storeAuthenticatedUserInStorage(Object.assign({}, user, { token }));
}

export function getAuthenticatedUserInStorage() {
	return getItemInLocalStorage<AuthenticatedUser>(USER_KEY);
}

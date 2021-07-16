export function storeInLocalStorage<T = unknown>(key: string, data: T): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(data));
}

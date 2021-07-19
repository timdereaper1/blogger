export type Privileges = 'super_admin' | 'user';

export interface ApiRequest<T> {
	data?: T;
	error?: string;
}

export type ApiRequestPromise<T> = Promise<ApiRequest<T>>;

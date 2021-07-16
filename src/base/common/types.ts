export interface ApiRequest<T> {
	data?: T;
	error?: string;
}

export type ApiRequestPromise<T> = Promise<ApiRequest<T>>;

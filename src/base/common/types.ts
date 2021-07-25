export type Privileges = 'super_admin' | 'user';

export interface ApiRequest<T> {
	data?: T;
	error?: string;
}

export type ApiRequestPromise<T> = Promise<ApiRequest<T>>;

export interface SuccessMutationResponse {
	message: string;
	success: boolean;
}

export interface AuthenticatedUser {
	email: string;
	name: string;
	token: string;
	id: string;
	privileges: Privileges[];
}

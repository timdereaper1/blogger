import { Privileges } from 'src/base/common/types';

export interface UserLoginCredentials {
	email: string;
	password: string;
}

export interface AuthenticatedUser {
	email: string;
	name: string;
	token: string;
	id: string;
	privileges: Privileges[];
}

export interface UserSignUpCredentials {
	email: string;
	name: string;
	password: string;
	privileges: ['user'];
}

export interface UserPasswordResetCredentials {
	email: string;
}

export interface ResetPasswordCredentials {
	password: string;
}

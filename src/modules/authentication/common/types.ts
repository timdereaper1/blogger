export interface UserLoginCredentials {
	email: string;
	password: string;
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

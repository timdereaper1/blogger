export interface UserLoginCredentials {
	email: string;
	password: string;
}

export interface LoggedInUser {
	email: string;
	name: string;
	token: string;
}

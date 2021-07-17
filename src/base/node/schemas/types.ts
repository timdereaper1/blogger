export interface UserSchema {
	email: string;
	password: string;
	name: string;
}

export type DBUser = UserSchema & {
	_id: string;
};

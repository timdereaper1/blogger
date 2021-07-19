import { Privileges } from 'src/base/common/types';

export interface UserSchema {
	email: string;
	password: string;
	name: string;
	privileges: Privileges[];
}

export type DBUser = UserSchema & {
	_id: string;
};

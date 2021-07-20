import { UserSignUpCredentials } from 'src/modules/authentication/common/types';

export interface UserSignUpCredentialsForm extends UserSignUpCredentials {
	confirmPassword: string;
}

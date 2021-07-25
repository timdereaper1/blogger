import {
	ResetPasswordCredentials,
	UserSignUpCredentials,
} from 'src/modules/authentication/common/types';

export interface UserSignUpCredentialsForm extends UserSignUpCredentials {
	confirmPassword: string;
}

export interface ResetPasswordCredentialsForm extends ResetPasswordCredentials {
	confirmPassword: string;
}

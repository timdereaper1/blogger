import * as yup from 'yup';

export const loginValidateSchema = yup.object().shape({
	email: yup
		.string()
		.required('email is required')
		.email('must be a valid email')
		.typeError('must be a valid email'),
	password: yup
		.string()
		.required('password is required')
		.min(6, 'password must not be less than 6 characters')
		.max(16, 'password must not be more than 16 characters')
		.typeError('must be a valid password'),
});

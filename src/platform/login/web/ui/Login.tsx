import { useMutation } from '@apollo/client';
import { getIn, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { UserLoginCredentials } from '../../common/types';
import { storeLoggedInUser } from '../common/storage';
import { USER_LOGIN_MUTATION } from '../graphql/schema';
import { loginValidateSchema } from '../services/validateSchema';

export default function Login() {
	const { push } = useRouter();
	const [login] = useMutation(USER_LOGIN_MUTATION);
	const form = useFormik<UserLoginCredentials>({
		initialValues: {
			email: '',
			password: '',
		},
		onSubmit,
		validationSchema: loginValidateSchema,
		validateOnMount: true,
	});

	function getFieldError(field: keyof UserLoginCredentials): string | null {
		const touched = getIn(form.touched, field);
		const error = getIn(form.errors, field);
		return touched && error ? error : null;
	}

	async function onSubmit() {
		const { data, errors } = await login({
			variables: { credentials: form.values },
		});
		form.setSubmitting(false);
		if (!data) return;
		form.resetForm();
		storeLoggedInUser(data);
		push('/');
	}

	return (
		<main>
			<h1 data-testid="title">Personal Blogger</h1>
			<form onSubmit={form.handleSubmit}>
				<label htmlFor="email">
					Email
					<input
						value={form.values.email}
						onChange={form.handleChange}
						type="email"
						name="email"
						id="email"
						required
						onBlur={form.handleBlur}
					/>
				</label>
				{getFieldError('email') ? (
					<small data-testid="error-helper">{getFieldError('email')}</small>
				) : null}
				<label htmlFor="password">
					Password
					<input
						type="password"
						onBlur={form.handleBlur}
						name="password"
						id="password"
						required
						value={form.values.password}
						onChange={form.handleChange}
					/>
				</label>
				{getFieldError('password') ? (
					<small data-testid="error-helper">{getFieldError('password')}</small>
				) : null}
				<button disabled={!(form.dirty && form.isValid)} type="submit">
					Login
				</button>
				{form.isSubmitting ? <i data-testid="loading">loading</i> : null}
			</form>
		</main>
	);
}

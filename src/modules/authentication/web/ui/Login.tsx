import { useRouter } from 'next/router';
import { useForm } from 'src/base/web/hooks/useForm';
import { UserLoginCredentials } from 'src/modules/authentication/common/types';
import { useLogin } from 'src/modules/authentication/web/hooks/useLogin';
import { storeLoggedInUser } from 'src/modules/authentication/web/storage';
import { loginValidateSchema } from 'src/modules/authentication/web/validateSchema';

export default function Login() {
	const { push } = useRouter();
	const verifyCredentials = useLogin();
	const form = useForm<UserLoginCredentials>({
		initialValues: {
			email: '',
			password: '',
		},
		onSubmit,
		validationSchema: loginValidateSchema,
	});

	async function onSubmit() {
		form.setSubmitting(true);
		const { data } = await verifyCredentials(form.values);
		form.setSubmitting(false);
		if (!data) return;
		form.resetForm();
		storeLoggedInUser(data);
		push('/dashboard');
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
				{form.getFieldError('email') ? (
					<small data-testid="error-helper">{form.getFieldError('email')}</small>
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
				{form.getFieldError('password') ? (
					<small data-testid="error-helper">{form.getFieldError('password')}</small>
				) : null}
				<button disabled={!(form.dirty && form.isValid)} type="submit">
					Login
				</button>
				{form.isSubmitting ? <i data-testid="loading">loading</i> : null}
			</form>
		</main>
	);
}

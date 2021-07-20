import { useRouter } from 'next/router';
import { useForm } from 'src/base/web/hooks/useForm';
import Notification from 'src/base/web/ui/Notification';
import { useSignUp } from 'src/modules/authentication/web/hooks/useSignUp';
import { storeLoggedInUser } from 'src/modules/authentication/web/storage';
import { UserSignUpCredentialsForm } from 'src/modules/authentication/web/types';
import { signUpValidateSchema } from 'src/modules/authentication/web/validateSchema';

export default function SignUp() {
	const signUp = useSignUp();
	const { push } = useRouter();
	const form = useForm<UserSignUpCredentialsForm>({
		initialValues: {
			email: '',
			password: '',
			name: '',
			confirmPassword: '',
			privileges: ['user'],
		},
		onSubmit,
		validationSchema: signUpValidateSchema,
	});

	async function onSubmit() {
		form.setSubmitting(true);
		const { data } = await signUp(form.values);
		form.setSubmitting(false);
		if (!data) return;
		storeLoggedInUser(data);
		push('/dashboard');
	}

	return (
		<main>
			<form onSubmit={form.handleSubmit}>
				<label htmlFor="name">
					Name
					<input
						type="text"
						onChange={form.handleChange}
						required
						name="name"
						id="name"
						onBlur={form.handleBlur}
						value={form.values.name}
					/>
				</label>
				{form.getFieldError('name') ? (
					<small data-testid="error-helper">{form.getFieldError('name')}</small>
				) : null}
				<label htmlFor="email">
					Email
					<input
						type="email"
						onChange={form.handleChange}
						name="email"
						onBlur={form.handleBlur}
						required
						value={form.values.email}
						id="email"
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
						onChange={form.handleChange}
						required
						value={form.values.password}
						id="password"
					/>
				</label>
				{form.getFieldError('password') ? (
					<small data-testid="error-helper">{form.getFieldError('password')}</small>
				) : null}
				<label htmlFor="confirmPassword">
					Confirm Password
					<input
						type="password"
						name="confirmPassword"
						onBlur={form.handleBlur}
						required
						onChange={form.handleChange}
						value={form.values.confirmPassword}
						id="confirmPassword"
					/>
				</label>
				{form.getFieldError('confirmPassword') ? (
					<small data-testid="error-helper">
						{form.getFieldError('confirmPassword')}
					</small>
				) : null}
				<button type="submit" disabled={!(form.dirty && form.isValid)}>
					Sign Up
				</button>
			</form>
			<Notification />
		</main>
	);
}

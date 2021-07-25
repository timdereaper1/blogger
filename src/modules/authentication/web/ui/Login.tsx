import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'src/base/web/hooks/useForm';
import { storeAuthenticatedUserInStorage } from 'src/base/web/storage';
import Notification from 'src/base/web/ui/Notification';
import type { UserLoginCredentials } from 'src/modules/authentication/common/types';
import { useLogin } from 'src/modules/authentication/web/hooks/useLogin';
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
		storeAuthenticatedUserInStorage(data);
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
					{form.getFieldError('email') ? (
						<small data-testid="error-helper">{form.getFieldError('email')}</small>
					) : null}
				</label>
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
					{form.getFieldError('password') ? (
						<small data-testid="error-helper">{form.getFieldError('password')}</small>
					) : null}
				</label>
				<div>
					<Link href="/auth/forgotten-password">
						<a>Forgotten Password</a>
					</Link>
				</div>
				<button disabled={!(form.dirty && form.isValid)} type="submit">
					Login
				</button>
				{form.isSubmitting ? <span role="progressbar">loading</span> : null}
			</form>
			<p>
				<small>
					Don't have an account?
					<Link href="/auth/signup">
						<a>Sign Up</a>
					</Link>
				</small>
			</p>
			<Notification />
		</main>
	);
}

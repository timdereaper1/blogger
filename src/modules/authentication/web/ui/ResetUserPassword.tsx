import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'src/base/web/hooks/useForm';
import Notification from 'src/base/web/ui/Notification';
import { ResetPasswordCredentialsForm } from 'src/modules/authentication/web/types';
import { useResetPassword } from '../hooks/useResetPassword';
import { resetUserPasswordValidateSchema } from '../validateSchema';

export default function ResetUserPassword() {
	const { query } = useRouter();
	const resetPassword = useResetPassword();
	const [message, setMessage] = React.useState('');
	const formik = useForm<ResetPasswordCredentialsForm>({
		initialValues: { password: '', confirmPassword: '' },
		onSubmit,
		validationSchema: resetUserPasswordValidateSchema,
	});

	async function onSubmit() {
		formik.setSubmitting(true);
		const response = await resetPassword(formik.values);
		formik.setSubmitting(false);
		if (response.error) return;
		formik.resetForm();
		setMessage('Password has been reset successfully. You can login with your new password');
	}

	return (
		<main>
			<h1 data-testid="title">Reset Password</h1>
			<form onSubmit={formik.handleSubmit}>
				<label htmlFor="password">
					Password
					<input
						type="password"
						name="password"
						id="password"
						value={formik.values.password}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={!query.token || formik.isSubmitting}
					/>
					{!formik.getFieldError('password') ? null : (
						<small data-testid="error-helper">{formik.getFieldError('password')}</small>
					)}
				</label>
				<label htmlFor="confirmPassword">
					Confirm Password
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						value={formik.values.confirmPassword}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						disabled={!query.token || formik.isSubmitting}
					/>
					{!formik.getFieldError('confirmPassword') ? null : (
						<small data-testid="error-helper">
							{formik.getFieldError('confirmPassword')}
						</small>
					)}
				</label>
				{!query.token ? null : (
					<button disabled={!(formik.dirty && formik.isValid)} type="submit">
						Reset Password
						{!formik.isSubmitting ? null : <span role="progressbar"></span>}
					</button>
				)}
			</form>
			{!message ? null : <div data-testid="message-box">{message}</div>}
			<Notification />
		</main>
	);
}

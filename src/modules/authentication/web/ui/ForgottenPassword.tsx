import React from 'react';
import { useForm } from 'src/base/web/hooks/useForm';
import Notification from 'src/base/web/ui/Notification';
import { UserPasswordResetCredentials } from 'src/modules/authentication/common/types';
import { useEmailPasswordReset } from 'src/modules/authentication/web/hooks/useEmailPasswordReset';
import { passwordResetValidateSchema } from 'src/modules/authentication/web/validateSchema';

export default function ForgottenPassword() {
	const sendEmail = useEmailPasswordReset();
	const [message, setMessage] = React.useState('');
	const [canResendEmail, setIsResendAvailable] = React.useState(false);
	const formik = useForm<UserPasswordResetCredentials>({
		initialValues: { email: '' },
		onSubmit,
		validationSchema: passwordResetValidateSchema,
	});

	React.useEffect(() => {
		if (canResendEmail) return;
		const DELAY_ONE_MINUTE = 1000 * 60;
		const timerId = setTimeout(() => setIsResendAvailable(true), DELAY_ONE_MINUTE);
		return () => clearTimeout(timerId);
	}, [canResendEmail]);

	async function onSubmit() {
		formik.setSubmitting(true);
		setIsResendAvailable(false);
		const response = await sendEmail(formik.values);
		formik.setSubmitting(false);
		if (response.error) return;
		setMessage(`An email has been sent to ${formik.values.email} to reset the password`);
	}

	return (
		<main>
			<h1>Forgotten Password</h1>
			<p data-testid="description">
				To reset your password, enter your login email and an email will be sent to the
				address.
			</p>
			<form onSubmit={formik.handleSubmit}>
				<label htmlFor="email">
					Email
					<input
						type="email"
						required
						name="email"
						id="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
					{!formik.getFieldError('email') ? null : (
						<small data-testid="error-helper">{formik.getFieldError('email')}</small>
					)}
				</label>
				<button disabled={!(formik.dirty && formik.isValid)} type="submit">
					Send Email
				</button>
				{!formik.isSubmitting ? null : <span role="progressbar"></span>}
			</form>
			{!message ? null : (
				<section>
					<div data-testid="message-box">{message}</div>
					<button disabled={!canResendEmail} onClick={formik.submitForm} type="button">
						Resend
					</button>
				</section>
			)}
			<Notification />
		</main>
	);
}

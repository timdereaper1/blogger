import { FormikConfig, getIn, useFormik } from 'formik';

export function useForm<TValues>(config: FormikConfig<TValues>) {
	const formik = useFormik(config);

	function getFieldError(field: string): string | null {
		const touched = getIn(formik.touched, field);
		const error = getIn(formik.errors, field);
		return touched && error ? error : null;
	}

	return {
		...formik,
		getFieldError,
	};
}

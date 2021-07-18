import { loginValidateSchema } from 'src/platform/login/web/validateSchema';

describe('loginValidateSchema', () => {
	it('should check email is formatted correctly', (done) => {
		loginValidateSchema.validateAt('email', { email: '34532' }).catch((err) => {
			expect(err.message).toBe('must be a valid email');
			done();
		});
	});

	it('should ensure email is required', (done) => {
		loginValidateSchema.validateAt('email', { email: '' }).catch((err) => {
			expect(err.message).toBe('email is required');
			done();
		});
	});

	it('should ensure email is of the right type', (done) => {
		loginValidateSchema.validateAt('email', { email: null }).catch((err) => {
			expect(err.message).toBe('must be a valid email');
			done();
		});
	});

	it('should return a valid email', (done) => {
		loginValidateSchema.validateAt('email', { email: 'test@test.com' }).then((result) => {
			expect(result).toBeDefined();
			done();
		});
	});

	it('should ensure password is a string', (done) => {
		loginValidateSchema.validateAt('password', { password: null }).catch((err) => {
			expect(err.message).toBe('must be a valid password');
			done();
		});
	});

	it('should not allow password more than 16 characters', (done) => {
		loginValidateSchema
			.validateAt('password', { password: '12345678912345678' })
			.catch((err) => {
				expect(err.message).toBe('password must not be more than 16 characters');
				done();
			});
	});

	it('should not allow password less than 6 characters', (done) => {
		loginValidateSchema.validateAt('password', { password: '21' }).catch((err) => {
			expect(err.message).toBe('password must not be less than 6 characters');
			done();
		});
	});

	it('should ensure password is required', (done) => {
		loginValidateSchema.validateAt('password', { password: '' }).catch((err) => {
			expect(err.message).toBe('password is required');
			done();
		});
	});

	it('should return a valid password', (done) => {
		loginValidateSchema.validateAt('password', { password: 'test24tom' }).then((result) => {
			expect(result).toBeDefined();
			done();
		});
	});
});

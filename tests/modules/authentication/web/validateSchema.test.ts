import {
	loginValidateSchema,
	passwordResetValidateSchema,
	signUpValidateSchema,
} from 'src/modules/authentication/web/validateSchema';

function testEmailSchema(schema: any) {
	it('should check email is formatted correctly', (done) => {
		schema.validateAt('email', { email: '34532' }).catch((err) => {
			expect(err.message).toBe('must be a valid email');
			done();
		});
	});

	it('should ensure email is required', (done) => {
		schema.validateAt('email', { email: '' }).catch((err) => {
			expect(err.message).toBe('email is required');
			done();
		});
	});

	it('should ensure email is of the right type', (done) => {
		schema.validateAt('email', { email: null }).catch((err) => {
			expect(err.message).toBe('must be a valid email');
			done();
		});
	});
}

function testPasswordSchema(schema: any) {
	it('should ensure password is a string', (done) => {
		schema.validateAt('password', { password: null }).catch((err) => {
			expect(err.message).toBe('must be a valid password');
			done();
		});
	});

	it('should not allow password more than 16 characters', (done) => {
		schema.validateAt('password', { password: '12345678912345678' }).catch((err) => {
			expect(err.message).toBe('password must not be more than 16 characters');
			done();
		});
	});

	it('should not allow password less than 6 characters', (done) => {
		schema.validateAt('password', { password: '21' }).catch((err) => {
			expect(err.message).toBe('password must not be less than 6 characters');
			done();
		});
	});

	it('should ensure password is required', (done) => {
		schema.validateAt('password', { password: '' }).catch((err) => {
			expect(err.message).toBe('password is required');
			done();
		});
	});
}

describe('loginValidateSchema', () => {
	describe('validate email', () => {
		testEmailSchema(loginValidateSchema);
	});

	describe('validate password', () => {
		testPasswordSchema(loginValidateSchema);
	});
});

describe('signUpValidateSchema', () => {
	describe('email', () => {
		testEmailSchema(signUpValidateSchema);
	});

	describe('password', () => {
		testPasswordSchema(signUpValidateSchema);
	});

	describe('name', () => {
		it('should ensure name is required', (done) => {
			signUpValidateSchema.validateAt('name', { name: '' }).catch((err) => {
				expect(err.message).toBe('name is required');
				done();
			});
		});

		it('should ensure name is not less than 3 characters', (done) => {
			signUpValidateSchema.validateAt('name', { name: '23' }).catch((err) => {
				expect(err.message).toBe('name must not be less than 3 characters');
				done();
			});
		});

		it('should ensure name is a string', (done) => {
			signUpValidateSchema.validateAt('name', { name: null }).catch((err) => {
				expect(err.message).toBe('must be a valid name');
				done();
			});
		});
	});

	describe('confirmPassword', () => {
		it('should match password', (done) => {
			signUpValidateSchema
				.validateAt('confirmPassword', { confirmPassword: '1234567', password: '123456' })
				.catch((err) => {
					expect(err.message).toBe('does not match password');
					done();
				});
		});
	});
});

describe('passwordResetValidateSchema', () => {
	describe('email', () => {
		testEmailSchema(passwordResetValidateSchema);
	});
});

import { BadRequestError, CustomError } from 'src/base/common/errors';

describe('CustomError', () => {
	it('should have a name of CustomError', () => {
		const error = new CustomError();
		expect(error.name).toBe('CustomError');
	});

	it('should have a property of isCustom', () => {
		const error = new CustomError();
		expect(error.isCustom).toBeDefined();
		expect(error.isCustom).toBeTruthy();
	});
});

describe('BadRequestError', () => {
	it('should have a name of BadRequestError', () => {
		const error = new BadRequestError('Bad request');
		expect(error.name).toBe('BadRequestError');
	});

	it('should have a status of 400', () => {
		const error = new BadRequestError('Bad request');
		expect(error.status).toBe(400);
	});

	it('should have an error code of request/bad-request', () => {
		const error = new BadRequestError('Bad request');
		expect(error.code).toBe('request/bad-request');
	});

	it('should have a custom error code', () => {
		const error = new BadRequestError('Bad request', 'custom/error-code');
		expect(error.code).toBe('custom/error-code');
	});

	it('should have a property of isCustom', () => {
		const error = new BadRequestError('Bad request');
		expect(error.isCustom).toBeDefined();
		expect(error.isCustom).toBeTruthy();
	});
});

export class CustomError extends Error {
	private isCustomError = true;

	constructor(public message: string = 'A custom error', public name = 'CustomError') {
		super(message);
	}

	get isCustom() {
		return this.isCustomError;
	}
}

export class BadRequestError extends CustomError {
	private errorStatus = 400;

	constructor(public message: string, private errorCode = 'request/bad-request') {
		super(message, 'BadRequestError');
	}

	get status() {
		return this.errorStatus;
	}

	get code() {
		return this.errorCode;
	}
}

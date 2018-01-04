import { IResDto } from '../Lib/interfaces';
// only for debugging
// import { dd } from '../Lib/Debug';

// Response to a successful request that won't be returning a body
export class NoContent implements IResDto {
	public status = 204;
	public success = true;
	public message = 'No Content';

	constructor() {
	}
}

// Used for validation errors
export class Error400 implements IResDto {
	public status = 400;
	public success = false;
	public message = 'Request could not be understood due to malformed syntax. You SHOULD NOT repeat the request without modifications.';
	public errors = false;

	constructor(errors = null) {
		if (errors) { this.errors = errors; }
	}
}

// Failed Auth
export class Error401 implements IResDto {
	public status = 401;
	public success = false;
	public message = 'Authentication failed';
	public errors;

	constructor(message = null) {
		if (message) { this.errors = message; }
	}
}

// not found
export class Error404 implements IResDto {
	public status = 404;
	public success = false;
	public message = 'The requested resource could not be found but may be available in the future.';

	constructor(message = null) {
		if (message) { this.message = message; }
	}
}

// bad-Headers
export class Error406 implements IResDto {
	public status = 406;
	public success = false;
	public message = `Requests header must contain: \'content-type\': \'application/x-www-form-urlencoded\' OR  \'content-type\': \'application/json\'`;

	constructor(message = null) {
		if (message) { this.message = message; }
	}
}

// Internal Server Error
export class Error500 implements IResDto {
	public status = 500;
	public success = false;
	public message = 'Internal Server Error';

	constructor(message = null) {
		if (message) { this.message = message; }
	}
}

// Success Auth
export class Auth implements IResDto {
	public status = 200;
	public success = true;
	public message = 'Authentication successful';
	public data;

	constructor(params) {
		if ((params)) { this.data = params; }
	}
}

// Success GET
export class Get implements IResDto {
	public status = 200;
	public success = true;
	public message = 'Resource found';
	public data;
	public limit;
	public offset;
	public count;

	constructor(params = null) {
		if (!params || Object.keys(params).length === 0) { return <any>new Error404; }

		const { rows = false, count = -1, limit, offset } = params;
		if ((rows) && count >= 0) {
			this.data = rows;
			this.count = count;
			this.limit = params.limit;
			this.offset = params.offset;

		} else {
			this.data = params;
		}
	}
}

// Success POST
export class Post implements IResDto {
	public status = 201;
	public success = true;
	public message = 'Resource created';
	public data;

	constructor(params) {
		if (params) { this.data = params; }
	}
}

// Success PUT
export class Put implements IResDto {
	public status = 200;
	public success = true;
	public message = 'Resource updated';
	public data;

	constructor(params) {
		if (params) { this.data = params; }
	}
}

// Success DELETE
export class Delete implements IResDto {
	public status = 200;
	public success = true;
	public message = 'Resource deleted';

	constructor(params) {
	}
}

export class Http200 {
	public status = 200;
	public message = 'Resource found';
	public data;
	public limit;
	public offset;
	public count;

	constructor(params: any = {}) {
		if (!params || Object.keys(params).length === 0) { return <any>new Http404; }

		const { rows = false, count = -1, limit, offset, method = '' } = params;
		switch (method) {
			case 'PUT':
				this.message = 'Resource updated';
				break;
			case 'DELETE':
				this.message = 'Resource deleted';
				break;
			default:
				this.message = 'Resource found';
				break;
		}

		// pending
		if ((rows) && count >= 0) {
			this.data = rows;
			this.count = count;
			this.limit = limit;
			this.offset = offset;

		} else {
			this.data = params;
		}
	}
}

// Success POST
export class Http201 {
	public status = 201;
	public message = 'Resource created';
	public data;

	constructor(params) {
		if (params) { this.data = params; }
	}
}

// Response to a successful request that won't be returning a body
export class Http204 {
	public status = 204;
}

// Used for validation errors
export class Http400 {
	public status = 400;
	public message = 'Request could not be understood due to malformed syntax. You SHOULD NOT repeat the request without modifications.';
	public errors;

	constructor(Exceptions: string[] = []) {
		this.errors = Exceptions.reduce((acc, E) => {
			if (E) {
				acc.push(E);
			}

			return acc;
		}, []);
	}
}

// Failed Auth
export class Http401 {
	public status = 401;
	public message = 'Unauthorized: Access is denied due to invalid credentials or permissions.';
	public errors;

	constructor(Exceptions: string[] = []) {
		this.errors = Exceptions.reduce((acc, E) => {
			if (E) {
				acc.push(E);
			}

			return acc;
		}, []);
	}
}

// Failed Auth
export class Http403 {
	public status = 403;
	public message = 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort and the request SHOULD NOT be repeated.';
	public errors;

	constructor(Exceptions: string[] = []) {
		this.errors = Exceptions.reduce((acc, E) => {
			if (E) {
				acc.push(E);
			}

			return acc;
		}, []);
	}
}

// not found
export class Http404 {
	public status = 404;
	public message = 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.';
}

// bad-Headers
export class Http406 {
	public status = 406;
	public message = `The requested resource is capable of generating only content not acceptable according to the Content-Type sent in the request.`;
	public errors;

	constructor(Exceptions: string[] = []) {
		this.errors = Exceptions.reduce((acc, E) => {
			if (E) {
				acc.push(E);
			}

			return acc;
		}, []);
	}
}

// Internal Server Error
export class Http500 {
	public status = 500;
	public message = 'Internal Server Error';

	constructor(message = {}) {
		console.error(message);
	}
}

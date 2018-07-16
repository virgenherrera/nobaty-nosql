import * as Joi from 'joi';
import { authKeys } from '../config/config';

export function schemaValidator(params: any, schema: any, convert: boolean = false): any {
	if (!schema) {
		console.error(`Validation Schema was not provided!`);

		throw { type: 500, msg: 'internal server error' };
	}

	// prevent crash by auto reqParams
	delete params[authKeys.decodedToken];
	delete params[authKeys.token];
	delete params[authKeys.user];

	const { error, value } = Joi.validate(params, schema, { convert });
	if (error) {

		const [obj] = error.details;
		throw { type: 400, msg: obj.message };
	}

	return value;
}

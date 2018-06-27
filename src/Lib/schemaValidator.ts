import * as Joi from 'joi';

export function schemaValidator(params: any, schema: any, convert: boolean = false): any {
	if (!schema) {
		console.error(`Validation Schema was not provided!`);

		throw { type: 500, msg: 'internal server error' };
	}

	const { error, value } = Joi.validate(params, schema, { convert });
	if (error) {

		const [obj] = error.details;
		throw { type: 400, msg: obj.message };
	}

	return value;
}

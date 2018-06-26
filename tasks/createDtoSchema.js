"use strict";
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const parseCliArgs = require("./lib/parseCliArgs");
const { toCamelCase } = require('./lib/stringTransformation');

function propValidator(attr = null, type = null) {
	if (!attr || !type) return;
	let validator;
	switch (type.toLowerCase()) {
		case 'string':
			validator = 'Joi.string(),';
			break;
		case 'number':
			validator = 'Joi.number(),';
			break;
		case 'date':
			validator = 'Joi.date(),';
			break;

		default:
			return;
	}

	return `	${attr}: ${validator}${'\n'}`;
}

return (() => {
	let { name = null, attributes = null } = parseCliArgs();
	let propContent = '';
	let propAssignContent = '';
	const ModuleRegExp = new RegExp("{{Module}}", "g");
	const parameterValidatorsRegExp = new RegExp("{{parameterValidators}}", "g");
	const origin = join(__dirname, './lib/templates/dtoSchema.example');
	const destiny = join(__dirname, `../src/Dto/${toCamelCase(name)}.ts`);
	const fileContent = readFileSync(origin, 'utf-8').toString();

	if (!name) {
		console.error(`Cannot create unnamed repository`);
		process.exit(1);
	}

	if (!attributes) {
		attributes = [
			['demoAttr1', "string"],
			['demoAttr2', "string"],
			['demoAttr3', "string"],
		];
	}

	attributes.forEach(row => {
		let [attr = null, type = null] = row;
		propContent += propValidator(attr, type);
	});

	const newContent = fileContent
		.replace(ModuleRegExp, toCamelCase(name))
		.replace(parameterValidatorsRegExp, propContent);

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Dto:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

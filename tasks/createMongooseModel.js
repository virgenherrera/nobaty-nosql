"use strict";
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { ucFirst, toCamelCase } = require('./lib/stringTransformation');
const parseCliArgs = require("./lib/parseCliArgs");

function interfaceCont(attr = null, type = null) {
	if (!attr || !type) return;
	type = (type === 'date') ? 'Date' : type;
	return `	${attr}: ${type};${"\n"}`;
}

function schemaAttrCont(attr = null, type = null) {
	if (!attr || !type) return;
	return `	${attr}: {
		index: false,
		unique: false,
		required: false,
		type: ${ucFirst(type)},
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: '${attr}_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid ${attr}!'
		// },
	},${'\n'}`;
}

return (() => {
	let {
		name = null, attributes = null
	} = parseCliArgs();
	let iContent = '';
	let schemaDefinition = '';
	const ModuleRegex = new RegExp("{{Module}}", "g");
	const iContRegex = new RegExp("{{iCont}}", "g");
	const schemaDefRegex = new RegExp("{{schemaDef}}", "g");
	const origin = join(__dirname, './lib/templates/mongooseModel.example');
	const destiny = join(__dirname, `../src/Model/${toCamelCase(name)}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');

	if (!name) {
		console.error(`Cannot create unnamed model`);
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
		iContent += interfaceCont(attr, type);
		schemaDefinition += schemaAttrCont(attr, type);
	});

	const newContent = fileContent
		.toString()
		.replace(ModuleRegex, toCamelCase(name))
		.replace(iContRegex, iContent)
		.replace(schemaDefRegex, schemaDefinition);

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

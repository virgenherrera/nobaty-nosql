"use strict";
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const parseCliArgs = require("./lib/parseCliArgs");
const { toCamelCase } = require('./lib/stringTransformation');

function propCont(attr = null, type = null) {
	if (!attr || !type) return;
	return `${'\n\t'}public ${attr};`;
}

function propAssign(attr = null) {
	if (!attr) return;
	return `${'\n\t\t'}this.${attr} = params.${attr};`;
}

return (() => {
	let { name = null, attributes = null } = parseCliArgs();
	let propContent = '';
	let propAssignContent = '';
	const ModuleRegExp = new RegExp("{{Module}}", "g");
	const propDefinitionRegExp = new RegExp("{{propDefinition}}", "g");
	const propAssignRegExp = new RegExp("{{propAssign}}", "g");
	const origin = join(__dirname, './lib/templates/poco.example');
	const destiny = join(__dirname, `../src/Poco/${toCamelCase(name)}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');

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
		propContent += propCont(attr, type);
		propAssignContent += propAssign(attr);
	});

	const newContent = fileContent
		.toString()
		.replace(ModuleRegExp, toCamelCase(name))
		.replace(propDefinitionRegExp, propContent)
		.replace(propAssignRegExp, propAssignContent);

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Poco:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

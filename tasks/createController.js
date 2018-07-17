"use strict";
const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { toCamelCase } = require('./lib/stringTransformation');
const parseCliArgs = require("./lib/parseCliArgs");

return (() => {
	let { name = null, force } = parseCliArgs();
	const lowerRegEx = new RegExp("{{module}}", "g");
	const CamelRegEx = new RegExp("{{Module}}", "g");
	const CamelName = toCamelCase(name);
	const origin = join(__dirname, './lib/templates/Controller.example');
	const destiny = join(__dirname, `../src/Controller/${CamelName}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');
	const newContent = fileContent
		.toString()
		.replace(lowerRegEx, name)
		.replace(CamelRegEx, CamelName);

	if (!name) {
		console.error(`Cannot create unnamed controller`);
		process.exit(1);
	}

	if (existsSync(destiny) && !force) {
		console.error(`Cannot Overwrite!${"\n"}Controller:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

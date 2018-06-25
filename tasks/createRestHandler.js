"use strict";
const {
	existsSync,
	appendFileSync,
	writeFileSync,
	readFileSync
} = require('fs');
const {
	join
} = require('path');
const parseCliArgs = require("./lib/parseCliArgs");
const toPascalCase = require('./lib/toPascalCase');
const to_snake_case = require('./lib/to_snake_case');

return (() => {
	let {
		name = null
	} = parseCliArgs();
	const snake_name = to_snake_case(name);
	const loaderFile = join(__dirname, '../src/config/handler.ts');
	const origin = join(__dirname, './lib/templates/restHandler.example');
	const destiny = join(__dirname, `../src/handler/restful/${snake_name}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');
	const lowerRegEx = new RegExp("{{module}}", "g");
	const CamelRegEx = new RegExp("{{Module}}", "g");
	const CamelName = toPascalCase(name);
	const exportHandler = `export { default as api_${snake_name} } from '../Handler/Restful/${snake_name}';${"\n"}`;
	const newContent = fileContent
		.toString()
		.replace(lowerRegEx, snake_name)
		.replace(CamelRegEx, CamelName);

	if (!name) {
		console.error(`Cannot create unnamed handler`);
		process.exit(1);
	}

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		appendFileSync(loaderFile, exportHandler, {
			encoding: 'utf-8'
		})
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

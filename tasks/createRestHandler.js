"use strict";
const { existsSync, appendFileSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const pluralize = require('pluralize');
const parseCliArgs = require("./lib/parseCliArgs");
const { toCamelCase } = require('./lib/stringTransformation');
const { to_snake_case } = require('./lib/stringTransformation');

function newRoutePaths(key = null) {
	return (!key)
		? undefined
		: `@apiV1Path() public static ${key} = '${to_snake_case(pluralize(key))}';
	@apiV1Path() public static ${key}_Id = '${to_snake_case(pluralize(key))}/:id';${'\n'}`;
}

return (() => {
	const { name = null } = parseCliArgs();
	const snake_name = to_snake_case(name);
	const loaderFile = join(__dirname, '../src/config/handler.ts');
	const origin = join(__dirname, './lib/templates/restHandler.example');
	const destiny = join(__dirname, `../src/handler/restful/${snake_name}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');
	const routePathFilePath = join(__dirname, '../src/config/routePath.ts');
	const routePathContent = readFileSync(routePathFilePath).toString();
	const lowerRegEx = new RegExp("{{module}}", "g");
	const CamelRegEx = new RegExp("{{Module}}", "g");
	const PluralRegEx = new RegExp("{{pluralModule}}", "g");
	const CamelName = toCamelCase(name);
	const exportHandler = `export { default as api_${snake_name} } from '../Handler/Restful/${snake_name}';${"\n"}`;
	const newContent = fileContent
		.toString()
		.replace(lowerRegEx, snake_name)
		.replace(PluralRegEx, pluralize(name))
		.replace(CamelRegEx, CamelName);
	const newRoutePathContent = routePathContent.replace(/^(.*)(\;\n)(\}\n)$/gm, '$1$2\n\t' + newRoutePaths(CamelName) + '$3');

	if (!name) {
		console.error(`Cannot create unnamed handler`);
		process.exit(1);
	}

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		appendFileSync(loaderFile, exportHandler, { encoding: 'utf-8' });
		writeFileSync(destiny, newContent, { encoding: 'utf-8' });
		writeFileSync(routePathFilePath, newRoutePathContent, { encoding: 'utf-8' });
	}
})();

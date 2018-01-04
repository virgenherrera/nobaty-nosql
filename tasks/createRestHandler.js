"use strict";
const {
	existsSync,
	appendFileSync,
	writeFileSync,
	readFileSync
} = require('fs');
const { join } = require('path');
const ucfirst = require('./lib/ucfirst');
const parseCliArgs = require("./lib/parseCliArgs");

return (()=>{
	let { name = null } = parseCliArgs();
	const loaderFile = join(__dirname, '../src/config/handler.ts');
	const origin = join(__dirname, './lib/templates/restHandler.example');
	const destiny = join(__dirname, `../src/handler/restful/${name}.ts`);
	const fileContent = readFileSync(origin, 'utf-8');
	const lowerRegEx = new RegExp("{{module}}", "g");
	const CamelRegEx = new RegExp("{{Module}}", "g");
	const CamelName = ucfirst(name);
	const newContent = fileContent.toString().replace(lowerRegEx, name).replace(CamelRegEx, CamelName);
	const exportHandler = `export { default as api_${name} } from '../Handler/Restful/${name}';${"\n"}`;

	if( !name ){
		console.error(`Cannot create unnamed handler`);
		process.exit(1);
	}

	if( existsSync( destiny ) ){
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		appendFileSync(loaderFile,exportHandler,{encoding:'utf-8'})
		writeFileSync(destiny,newContent,{encoding:'utf-8'});
	}
})();

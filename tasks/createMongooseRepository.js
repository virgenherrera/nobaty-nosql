"use strict";
const {
	existsSync,
	writeFileSync,
	readFileSync
} = require('fs');
const { join } = require('path');
const ucfirst = require('./lib/ucfirst');
const parseCliArgs = require("./lib/parseCliArgs");
const letCont = (attr = null) => {
	if (!attr) return;
	return `			${attr} = null,${"\n"}`;
}
const valAssign = (attr = null) => {
	if (!attr) return;
	return `		if( ${attr} ) Entity.${attr} = ${attr};${"\n"}`;
}

return (() => {
	let {
		name = null, attributes = null
	} = parseCliArgs();
	let letContent = '';
	let valContent = '';
	const moduleRegExp = new RegExp("{{module}}", "g");
	const ModuleRegExp = new RegExp("{{Module}}", "g");
	const letDeclarationsRegExp = new RegExp("{{letDeclarations}}", "g");
	const valAssignationsRegExp = new RegExp("{{valAssignations}}", "g");
	const origin = join(__dirname, './lib/templates/mongooseRepository.example');
	const destiny = join(__dirname, `../src/Repository/${ucfirst(name)}.ts`);
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
		letContent += letCont(attr, type);
		valContent += valAssign(attr, type);
	});

	const newContent = fileContent
		.toString()
		.replace(moduleRegExp, name)
		.replace(ModuleRegExp, ucfirst(name))
		.replace(letDeclarationsRegExp, letContent + `		`)
		.replace(valAssignationsRegExp, valContent);

	if (existsSync(destiny)) {
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

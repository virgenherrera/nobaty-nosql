'use strict';
const { join } = require('path');
const { existsSync, mkdirSync } = require('fs');
const { readFileSync, writeFileSync } = require('fs');
const { compilerOptions } = require('../tsconfig.json');
const { name, main } = require('../package.json');
const dest = join(__dirname, '../forever.json');
const srcFile = JSON.parse(readFileSync(join(__dirname, './lib/templates/forever.example')));

return (()=>{
	const logsPath = join(__dirname, '../logs');

	srcFile.uid = name;
	srcFile.script = main;
	srcFile.sourceDir = join(__dirname, '../');
	srcFile.logFile = join(__dirname, "../", srcFile.logFile);
	srcFile.outFile = join(__dirname, "../", srcFile.outFile);
	srcFile.errFile = join(__dirname, "../", srcFile.errFile);


	// create logs folder if not exists
	if ( !existsSync(logsPath ) ) {
		mkdirSync( logsPath );
	}

	return writeFileSync(dest, JSON.stringify(srcFile, null, 2));
})();


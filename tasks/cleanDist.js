"use strict";
const { join } = require('path');
const del = require('del');
const {
	compilerOptions
} = require('../tsconfig');
const distPath = join(__dirname, '../', compilerOptions.outDir);

return del.sync(distPath, {
	force: true
});

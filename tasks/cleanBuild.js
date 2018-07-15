"use strict";
const { join } = require('path');
const del = require('del');
const { compilerOptions } = require('../tsconfig');
const buildPath = join(__dirname, '../', compilerOptions.outDir);

return del.sync(buildPath, { force: true });

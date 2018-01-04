"use strict";
const {join}			= require('path');
const del				= require('del');
const {compilerOptions}	= require('../tsconfig');
const transpiledPath		= join(__dirname,'../', compilerOptions.outDir );

return del.sync( transpiledPath, {force:true} );

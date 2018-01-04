"use strict";
const {join}	= require('path');
const del		= require('del');
const logsPath	= join(__dirname,'../logs');

return del.sync([`${logsPath}/*.log`], {force:true} );

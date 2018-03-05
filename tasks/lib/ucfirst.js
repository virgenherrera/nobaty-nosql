"use strict";
require('ts-node').register();
const {
	ucFirst
} = require('../../src/Lib/stringTransformation');

// transforms the first letter of the string in uppercase
module.exports = ucFirst;

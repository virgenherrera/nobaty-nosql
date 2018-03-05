"use strict";
require('ts-node').register();
const {
	lowercaseFirstLetter
} = require('../../src/Lib/stringTransformation');

// transforms the first letter of the string in lowercase
module.exports = lowercaseFirstLetter;

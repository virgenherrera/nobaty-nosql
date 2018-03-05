#!/usr/bin/env node

const {
	argv
} = require('yargs');
const availableModules = ['rest-handler', 'controller', 'poco', 'repository', 'model'];

module.exports = function () {
	let {
		mod = null, name = null, attributes = null,
	} = argv;

	// normalize modules
	if (mod) {
		mod = mod
			.split(',')
			.map(m => (availableModules.indexOf(m) > -1) ? m : null)
			.filter(v => (v));
	}

	// if (name) {
	// 	// normalize name
	// 	name = name
	// 	// .replace(/\W/g, '')
	// 	// .replace(/\d/g, '')
	// 	// .toLowerCase()
	// 	;
	// }

	if (attributes) {
		// normalize attributes
		attributes = attributes
			.split(',')
			.map(row => {
				let [attr = null, value = null] = row.split(':');

				return (attr && value) ? [attr, value] : null;
			})
			.filter(v => (v));
	}

	return {
		mod,
		name,
		attributes,
	};
}

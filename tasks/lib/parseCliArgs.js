#!/usr/bin/env node

const { argv } = require('yargs');
const allValue = 'all';
const availableModules = ['rest-handler', 'controller', 'poco', 'repository', 'model', 'dto'];

module.exports = function () {
	let { mod = null, name = null, attributes = null, force = null } = argv;

	mod = (mod === allValue) ? availableModules.join() : mod;

	// normalize modules
	if (mod) {

		mod = mod
			.split(',')
			.filter((acc, curr) => {
				if (availableModules.indexOf(curr) > -1) {
					acc.push(curr)
				}

				return acc;
			}, []);
	}

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

	force = (force) ? true : false;

	return {
		mod,
		name,
		attributes,
		force,
	};
}

#!/usr/bin/env node

"use strict";
require('ts-node').register();
const {
	readdirSync,
	copyFileSync
} = require('fs');
const {
	join
} = require('path');
const {
	argv
} = require('yargs');
const moment = require('moment');
const {
	loadEnvironmentVars
} = require('../src/Lib/loadEnvironmentVars');
const {
	mongooseConnection
} = require('../src/Lib/mongooseConnection');
const Directories = require('../src/Lib/Directories').default;

const {
	create = null,
		name = null,
		run = null,
		undo = null,
} = argv;

if (create) {
	const normalizedName = name
		.replace(/\W/g, '')
		.replace(/\d/g, '')
		.toLowerCase();
	const newSeederName = `${moment().format('YYYYMMDDHHMMSS')}-${normalizedName}.js`;
	const origin = join(__dirname, '/lib/templates/mongooseSeeder.example');
	const destiny = join(Directories.seedersPath, newSeederName);

	return copyFileSync(origin, destiny);
} else {
	loadEnvironmentVars();
	mongooseConnection();

	readdirSync(Directories.seedersPath)
		.filter(seeder => (seeder.indexOf('.') !== 0) && (seeder.slice(-3) === '.js'))
		.forEach(seeder => {
			const {
				up = null, down = null
			} = require(join(Directories.seedersPath, seeder));
			if (!up || !down) {
				console.log(`skipping seeder file "${seeder}"`);
				console.log('since it does not export the "up" and "down" methods');
				return;
			}

			if (!run && !undo) {
				console.log('impossible to run any seeding action.');
				console.log('since no --run or --undo parameters were received');
				return process.exit(1);
			} else if (run && undo) {
				console.log('impossible to run any seeding action.');
				console.log('since --run and --undo parameters were received');
				return process.exit(1);
			} else if (run && !undo) {
				return up();
			} else if (!run && undo) {
				return down();
			}
		});
}

setTimeout(() => {
	return process.exit();
}, 15000);

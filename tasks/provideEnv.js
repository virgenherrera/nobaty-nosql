"use strict";
require('ts-node/register');

const { existsSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { name } = require('../package.json');
const { AVAILABLE_ENVIRONMENTS } = require('../src/config/config');

function persistenceContent(env = null, srvName = null) {
	if (!env || !srvName) return;

	const ENV = env.toUpperCase();
	let Res = `${'\n'}`;
	Res += `MONGO_${ENV}_ADDRESS=mongodb://127.0.0.1${'\n'}`;
	Res += `MONGO_${ENV}_PORT=27017${'\n'}`;
	Res += `MONGO_${ENV}_DATABASE=${srvName}_${ENV.toLowerCase()}${'\n'}`;

	return Res;
}

function genRandStr() {
	return Math.random().toString(36).slice(2).toUpperCase();
}

let PersistenceVars = '';
AVAILABLE_ENVIRONMENTS.forEach(Env => {
	PersistenceVars += persistenceContent(Env, name);
});


return (() => {
	const origin = join(__dirname, '../.env.example');
	const destiny = join(__dirname, '../', '.env');
	const fileContent = readFileSync(origin, 'utf-8');
	const replacers = {
		FirstEnv: AVAILABLE_ENVIRONMENTS[0],
		SERVICE_NAME: name,
		logUser: genRandStr(),
		logPass: genRandStr(),
		JWT_SECRET: genRandStr(),
		PersistenceVars: PersistenceVars,
	};

	let newContent = fileContent.toString();
	for (const k in replacers) {
		if (replacers.hasOwnProperty(k)) {
			const regex = new RegExp(`{{${k}}}`, 'g');
			newContent = newContent.replace(regex, replacers[k]);
		}
	}

	if (existsSync(destiny)) {
		console.log(`File: "${destiny}" already exists!`);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

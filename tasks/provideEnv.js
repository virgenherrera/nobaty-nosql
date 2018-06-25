"use strict";
require('ts-node/register');

const {
	existsSync,
	writeFileSync,
	readFileSync
} = require('fs');
const {
	join
} = require('path');
const {
	name
} = require('../package.json');
const {
	AVAILABLE_ENVIRONMENTS
} = require('../src/config/config');

function persistenceContent(env = null, srvName = null) {
	if (!env || !srvName) return;;

	const ENV = env.toUpperCase();
	let Res = `${'\n'}`;
	Res += `MONGO_${ENV}_ADDRESS=mongodb://127.0.0.1${'\n'}`;
	Res += `MONGO_${ENV}_PORT=27017${'\n'}`;
	Res += `MONGO_${ENV}_DATABASE=${srvName}_${ENV.toLowerCase()}${'\n'}`;

	return Res;
}

let PersistenceVars = '';
AVAILABLE_ENVIRONMENTS.forEach(Env => {
	PersistenceVars += persistenceContent(Env, name);
});


return (() => {
	const FirstEnvRegEx = new RegExp("{{FirstEnv}}", "g");
	const serviceNameRegEx = new RegExp("{{SERVICE_NAME}}", "g");
	const jwtSecretRegEx = new RegExp("{{JWT_SECRET}}", "g");
	const PersistenceVarsRegEx = new RegExp("{{PersistenceVars}}", "g");
	const ServiceName = name;
	const JwtSecret = Math.random().toString(36).slice(2).toUpperCase();
	const origin = join(__dirname, '../.env.example');
	const destiny = join(__dirname, '../', '.env');
	const fileContent = readFileSync(origin, 'utf-8');


	const newContent = fileContent
		.toString()
		.replace(FirstEnvRegEx, AVAILABLE_ENVIRONMENTS[0])
		.replace(serviceNameRegEx, ServiceName)
		.replace(jwtSecretRegEx, JwtSecret)
		.replace(PersistenceVarsRegEx, PersistenceVars);

	if (existsSync(destiny)) {
		console.log(`File: "${destiny}" already exists!`);
	} else {
		writeFileSync(destiny, newContent, {
			encoding: 'utf-8'
		});
	}
})();

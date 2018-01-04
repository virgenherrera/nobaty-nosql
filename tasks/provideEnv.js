"use strict";
require('ts-node/register');
const {
	existsSync,
	writeFileSync,
	readFileSync
} = require('fs');
const { join } = require('path');
const { name } = require('../package.json');
const { AVAILABLE_ENVIRONMENTS } = require('../src/config/config');
function persistanceContent(env = null, srvName = null) {
	if( !env || !srvName ) return;;

	const ENV = env.toUpperCase();
	let Res = `${'\n'}`;

	Res += `${ ENV }_DB_USERNAME=postgres${ '\n' }`;
	Res += `${ ENV }_DB_PASSWORD=postgres${ '\n' }`;
	Res += `${ ENV }_DB_DATABASE=${ srvName }_${ENV.toLowerCase()}${ '\n' }`;
	Res += `${ ENV }_DB_HOST=127.0.0.1${ '\n' }`;
	Res += `${ ENV }_DB_DIALECT=postgres${ '\n' }`;
	Res += `${ ENV }_DB_PORT=5432${ '\n' }`;

	return Res;
}

let PersistanceVars = '';
AVAILABLE_ENVIRONMENTS.forEach(Env => {
	PersistanceVars += persistanceContent(Env, name);
});


return (()=>{
	const FirstEnvRegEx = new RegExp("{{FirstEnv}}", "g");
	const serviceNameRegEx = new RegExp("{{SERVICE_NAME}}", "g");
	const jwtSecretRegEx = new RegExp("{{JWT_SECRET}}", "g");
	const PersistanceVarsRegEx = new RegExp("{{PersistanceVars}}", "g");
	const ServiceName = name;
	const JwtSecret = Math.random().toString(36).slice(2).toUpperCase();
	const origin = join(__dirname, './lib/templates/.env.example');
	const destiny = join(__dirname, '../', '.env');
	const fileContent = readFileSync(origin, 'utf-8');


	const newContent = fileContent
	.toString()
	.replace(FirstEnvRegEx, AVAILABLE_ENVIRONMENTS[0])
	.replace(serviceNameRegEx, ServiceName)
	.replace(jwtSecretRegEx,JwtSecret)
	.replace(PersistanceVarsRegEx, PersistanceVars)
	;

	if( existsSync( destiny ) ){
		console.error(`Cannot Overwrite!${"\n"}Handler:	${destiny}${"\n"}Already Exists`);
		process.exit(1);
	} else {
		writeFileSync(destiny,newContent,{encoding:'utf-8'});
	}
})();

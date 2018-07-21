import * as dotEnv from 'dotenv';
import Directories from '../System/Directories';
import { AVAILABLE_ENVIRONMENTS } from '../config/config';

/**
* Loads Environment Variables from /.env file
*/
export function loadEnvironmentVars(): void {
	const dotEnvFilePath = Directories.getPathToFile('basePath', '.env');

	if (!Directories.fileExists('basePath', '.env')) {
		console.log('cannot to load "ENVIRONMENT" vars');
		console.log('please be sure to have a properly defined ".env" file at this project root');
		console.log(`must be placed in: "${dotEnvFilePath}"`);
		console.log(`HINT: you can create one by typing one os the following commands:${'\n\t'}$ yarn provide-env${'\n\t'}$ npm run provide-env`);
		process.exit(1);
	}

	dotEnv.config({
		path: dotEnvFilePath
	});

	if (AVAILABLE_ENVIRONMENTS.indexOf(process.env.NODE_ENV) === -1) {
		console.log('service can not be started because NODE_ENV was configured with an illegal value.');
		console.log(`declare NODE_ENV in your .env file or in the terminal with one of the following allowed values:${'\n'}${JSON.stringify(AVAILABLE_ENVIRONMENTS)}`);
		process.exit(1);
	}

	console.log(`Successfully loaded Environment vars: from "${dotEnvFilePath}" file.`);
}

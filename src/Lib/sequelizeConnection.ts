// import { Sequelize } from 'sequelize-typescript';
// import Directories from '../Lib/Directories';

// export async function sequelizeConnection(): Promise<string | void> {
// 	const ENV = process.env.NODE_ENV.toUpperCase();
// 	const connParams: any = {
// 		username: process.env[`${ENV}_DB_USERNAME`],
// 		password: process.env[`${ENV}_DB_PASSWORD`],
// 		database: process.env[`${ENV}_DB_DATABASE`],
// 		host: process.env[`${ENV}_DB_HOST`],
// 		dialect: process.env[`${ENV}_DB_DIALECT`],
// 		port: process.env[`${ENV}_DB_PORT`],
// 		modelPaths: [Directories.ModelPath],
// 		logging: false
// 	};

// 	if (process.env.NODE_ENV === 'development') {
// 		connParams.logging = console.log;
// 		connParams.benchmark = true;
// 	}

// 	const sequelize = new Sequelize(connParams);
// 	try {
// 		const dbAuth = await sequelize.authenticate();
// 		return `${'\n'}Success connection to: "${connParams.database}" Database in ${connParams.host}:${connParams.port} server with SQL dialect: ${connParams.dialect}`;
// 	} catch ({ name, parent }) {
// 		console.log(`${name}: ${parent}`);
// 		console.log('please update your connection settings in .env file and make your sure your database service is up and running');
// 		process.exit(1);
// 	}
// }

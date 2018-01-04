import * as mongoose from 'mongoose';

export async function mongooseConnection(): Promise<string> {
	const ENV = process.env.NODE_ENV.toUpperCase();
	const mongoAddress = process.env[`MONGO_${ENV}_ADDRESS`];
	const mongoDatabase = process.env[`MONGO_${ENV}_DATABASE`];
	const ConnectionUri = `${mongoAddress}/${mongoDatabase}`;

	(<any>mongoose).Promise = global.Promise;

	if (ENV === 'DEVELOPMENT') {
		mongoose.set('debug', true);
	}
	let conn: any;

	try {
		conn = await mongoose.connect(ConnectionUri, { useMongoClient: true });
	} catch ({ name, message }) {

		console.log(`${name}: ${message}`);
		console.log('please update your connection settings in .env file and make your sure your mongodb service is running');
		process.exit(1);
	}

	return `${'\n'}Using "${ConnectionUri}" MongoDB Database`;
}

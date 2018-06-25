import * as http from 'http';
import * as debug from 'debug';
import * as os from 'os';
import * as socketIo from 'socket.io';
import { loadEnvironmentVars } from '../Lib/loadEnvironmentVars';
import { app } from '../app';
import { RealTimeService } from './RealTimeService';
import { DropPendingPurchases } from '../CronJob/DropPendingPurchases';

/**
* Load Environment Variables from .env
*/
loadEnvironmentVars();

/**
* declare Service PORT
*/
const port = normalizePort(process.env.SERVICE_PORT);

/**
* init Debugger
*/
debug(`${process.env.SERVICE_NAME}:server`);

/**
* Get port from environment and store in Express.
*/
app.set('port', port);

/**
* Create HTTP server.
*/
const server = http.createServer(app);

/**
* Bind RealTime Service to HTTP server.
*/
const ioServer = socketIo(server);
const rtService = new RealTimeService(ioServer);
rtService.status();

/**
* Listen on provided port, on all network interfaces.
*/
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Start cron jobs.
*/
DropPendingPurchases();


/**
* Normalize a port into a number, string, or false.
*/
function normalizePort(val: number | string): number | string | boolean {
	const pt: any = Number(val);

	if (isNaN(pt)) {
		return val;
	} else if (pt >= 0) {
		return pt;
	} else {
		return false;
	}
}

/**
* Event listener for HTTP server "error" event.
*/
function onError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') { throw error; }
	const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
* Event listener for HTTP server "listening" event.
*/
function onListening(): void {
	const addr = server.address();
	const bind = (typeof addr === 'string') ? `pipe: "${addr}"` : `port: "${addr.port}"`;
	const msg = `"${process.env.SERVICE_NAME}" is running on ${bind} in "${process.env.NODE_ENV}" mode`;

	debug(msg);
	console.log(msg);
	console.log(`	Listening in the following local addresses:`);

	// inform about localhost ip addresses
	const interfaces = os.networkInterfaces();
	for (const k in interfaces) {
		if (interfaces.hasOwnProperty(k)) {
			for (const k2 in interfaces[k]) {
				if (interfaces[k].hasOwnProperty(k2)) {
					const address = interfaces[k][k2];

					if (address.family === 'IPv4' && !address.internal) {
						console.log(`* http://${address.address}:${port}`);
					}
				}
			}
		}
	}
}

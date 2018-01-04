import * as SocketIo from 'socket.io';
import { SessionController } from '../Controller/Session';
import { USE_REAL_TIME_SERVICE } from '../config/config';

export let IO: any|null = null;

export class RealTimeService {
	constructor(ioServer) {
		if ( !USE_REAL_TIME_SERVICE ) {
			console.log(`/* Omitting the initialization of the Real-Time Service*/`);
			console.log(`	if you wish to activate it, change the value of "USE_REAL_TIME_SERVICE" to true in ./src/config/config.ts`);
			return;
		}

		if ( !(ioServer instanceof SocketIo) ) {
			throw new Error(`Cannot proceed, constructor must receive a valid instance of Socket.io initialized param.`);
		}

		// bubble Initialized SocketIo into a higher scope
		IO = ioServer;
		IO.on( 'connection', this.onConnectAuthenticate.bind(this) );
		console.log(`* Initialized RealTime Service${'\n'}`);
	}

	async onConnectAuthenticate(incomingSocket): Promise<void> {
		const { token = null } = incomingSocket.handshake.query;

		// kick-out user if doesn't provided a token
		if ( !token ) {
			incomingSocket.disconnect();
		}

		const ctrl = new SessionController();
		let decodedToken;

		try {
			decodedToken = await ctrl.validateAction( token );

			// call actual onConnect handler
			return this.onConnectHandler.call(this, incomingSocket, decodedToken);
		} catch ( E ) {
			console.log('Kicking-out user due Authentication Error');

			return incomingSocket.disconnect();
		}
	}

	onConnectHandler( incomingSocket: any = null, decodedToken: any = null ) {
		// prevent dummy execution
		if ( !incomingSocket || !decodedToken ) {
			return ;
		}

		/**
		 * Actual onConnection code here!!!
		 */
	}
}

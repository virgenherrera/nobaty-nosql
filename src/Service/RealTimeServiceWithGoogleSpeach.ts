import * as SocketIo from 'socket.io';
import { existsSync, mkdirSync, unlink, readFileSync } from 'fs';
import { resolve, join } from 'path';
import * as wav from 'wav';
import * as speech from '@google-cloud/speech';
import * as stream from 'stream';
import { SessionController } from '../Controller/Session';
import { USE_REAL_TIME_SERVICE } from '../config/config';
import Directories from '../Lib/Directories';

export let IO: any | null = null;

const speechClient = new speech.SpeechClient({
	projectId: process.env.GOOGLE_SPEECH_PROJECT_ID,
	keyFilename: join(Directories.googleSpeechConfigPath, 'api.json')
});

const audioDirectory = join(resolve('.'), 'audios');

export class RealTimeService {
	constructor(ioServer) {
		if (!USE_REAL_TIME_SERVICE) {
			console.log(`	/* Omitting the Real-Time Service*/`);
			console.log(`if you wish to activate it, change the value of "USE_REAL_TIME_SERVICE" to true in ./src/config/config.ts`);
			return;
		}

		if (!(ioServer instanceof SocketIo)) {
			throw new Error(`Cannot proceed, constructor must receive a valid instance of Socket.io initialized param.`);
		}

		if (!process.env.GOOGLE_SPEECH_PROJECT_ID) {
			throw new Error('It was not possible to start the real-time service, since you did not declare your "GOOGLE_SPEECH_PROJECT_ID" in the file "./.env"');
		}

		if (!existsSync(join(Directories.googleSpeechConfigPath, 'api.json'))) {
			throw new Error(`It was not possible to start the real-time service, since it is not possible to locate the "${join(Directories.googleSpeechConfigPath, 'api.json')}" file.`);
		}

		// bubble Initialized SocketIo into a higher scope
		IO = ioServer;
		IO.on('connection', this.onConnectAuthenticate.bind(this));
		console.log(`* Initialized RealTime Service${'\n'}`);

		if (!existsSync(audioDirectory)) {
			mkdirSync(audioDirectory);
		}
	}

	async onConnectAuthenticate(incomingSocket): Promise<void> {
		const { token = null } = incomingSocket.handshake.query;

		// kick-out user if doesn't provided a token
		if (!token) {
			incomingSocket.disconnect();
		}

		const ctrl = new SessionController();
		let decodedToken;

		try {
			decodedToken = await ctrl.validateAction(token);
			// call actual onConnect handler
			return this.onConnectHandler.call(this, incomingSocket, decodedToken);
		} catch (E) {
			console.log('Kicking-out user due Authentication Error');
			return incomingSocket.disconnect();
		}
	}


	onConnectHandler(incomingSocket: any = null, decodedToken: any = null) {
		// prevent dummy execution
		if (!incomingSocket || !decodedToken) {
			return;
		}

		// TODO: Move all of this to is own module.
		const newFilename = join(audioDirectory, incomingSocket.id + '.wav');
		let fileWriter = new wav.FileWriter(newFilename, {
			channels: 1,
			sampleRate: 48000,
			bitDepth: 16
		});

		incomingSocket.on('disconnect', (reason) => {
			// Destroy wav file if the user disconnects.
			unlink(newFilename, null);
		});


		incomingSocket.on('receive-audio', function (audioBuffer) {
			fileWriter.write(audioBuffer); // write audio buffer to file
		});

		incomingSocket.on('receive-audio-end', function () {

			fileWriter.end(); // Close the audio stream
			const audioBytes = readFileSync(newFilename).toString('base64');
			// The audio file's encoding, sample rate in hertz, and BCP-47 language code
			const request = {
				audio: {
					content: audioBytes
				},
				config: {
					encoding: 'LINEAR16',
					sampleRateHertz: 48000,
					languageCode: 'en-US',
				}
			};

			// Detects speech in the audio file
			speechClient
				.recognize(request)
				.then(data => {
					const response = data[0];
					const transcription = response.results
						.map(result => result.alternatives[0].transcript)
						.join('\n');
					// Destroy audio file & create a new one
					// console.log(transcription);
					unlink(newFilename, () => {
						incomingSocket.emit('on-transcript', { transcript: transcription });
						fileWriter = new wav.FileWriter(newFilename, {
							channels: 1,
							sampleRate: 48000,
							bitDepth: 16
						});
					});
				})
				.catch(err => {
					console.error('ERROR:', err);
				});

		});

		/**
		 * Actual onConnection code here!!!
		 */
	}
}

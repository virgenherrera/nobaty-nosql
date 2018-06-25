import * as admin from 'firebase-admin';
import Directories from './Directories';

enum priorities {
	normal = 'normal',
	high = 'high',
}

export class FirebasePushNotifications {
	public NODE_ENV;
	public RESTRICTED_PACKAGE_NAME;
	public PUSH_NOTIFICATION_EXPIRE;
	public serviceAccount;
	public options: admin.messaging.MessagingOptions = {};

	constructor(options: admin.messaging.MessagingOptions = {}) {
		const {
			NODE_ENV,
			RESTRICTED_PACKAGE_NAME,
			PUSH_NOTIFICATION_EXPIRE = 1,
			FIREBASE_DATABASE_URL = null,
		} = process.env;

		if (!FIREBASE_DATABASE_URL) {
			throw { type: 500, msg: `Internal Server Error. missing env var 'FIREBASE_DATABASE_URL'.` };
		}

		this.NODE_ENV = NODE_ENV;
		this.RESTRICTED_PACKAGE_NAME = RESTRICTED_PACKAGE_NAME;
		this.PUSH_NOTIFICATION_EXPIRE = PUSH_NOTIFICATION_EXPIRE;
		this.serviceAccount = Directories.getJsonFile('certsPath', 'firebase-admin-sdk.json');

		try {
			admin.initializeApp({
				credential: admin.credential.cert(this.serviceAccount),
				databaseURL: FIREBASE_DATABASE_URL
			});
		} catch (E) {
			console.log(E);
			console.log(admin);
		}

		this.configOptions(options);
	}

	static async send(registrationTokens: string[], payload: admin.messaging.MessagingPayload = null, options: admin.messaging.MessagingOptions = {}): Promise<admin.messaging.MessagingDevicesResponse> {
		try {
			const instance = new FirebasePushNotifications(options);
			return await instance.sendToDevice(registrationTokens, payload, options);
		} catch (E) {
			throw E;
		}
	}

	private configOptions(options: admin.messaging.MessagingOptions = {}) {
		this.options.collapseKey = (options.collapseKey) ? options.collapseKey : 'default';
		this.options.contentAvailable = (options.contentAvailable) ? true : false;
		this.options.dryRun = (options.dryRun) ? true : false;
		this.options.mutableContent = (options.mutableContent) ? true : false;
		this.options.priority = (options.priority && priorities.hasOwnProperty(options.priority)) ? options.priority : priorities.high;
		this.options.restrictedPackageName = (options.restrictedPackageName) ? options.restrictedPackageName : this.RESTRICTED_PACKAGE_NAME;
		this.options.timeToLive = (options.timeToLive) ? options.timeToLive : (<number>this.PUSH_NOTIFICATION_EXPIRE) * 60;

		return this;
	}

	public sendToDevice(registrationTokens: string[], { notification, data }: admin.messaging.MessagingPayload, options: admin.messaging.MessagingOptions = {}): Promise<admin.messaging.MessagingDevicesResponse> {
		return new Promise((Resolve, Reject) => {
			if (options) {
				this.configOptions(options);
			}

			const payload: any = {
				notification: { notification },
				data: {},
			};

			for (const k in data) {
				if (data.hasOwnProperty(k)) {
					payload.data[k] = `${data[k]}`;
				}
			}

			return admin
				.messaging()
				.sendToDevice(registrationTokens, payload, this.options)
				.then(res => {
					if (this.NODE_ENV.toLowerCase() !== 'production') {
						console.log(JSON.stringify(res, null, 4));
					}

					return Resolve(res);
				})
				.catch(err => {
					console.error(JSON.stringify(err));
					return Reject(err);
				});
		});
	}
}

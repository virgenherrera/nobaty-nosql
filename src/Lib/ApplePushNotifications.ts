import * as apn from 'apn';
import * as moment from 'moment';
import Directories from 'System/Directories';
import { isJson } from './isJson';

export class ApplePushNotifications {

	notificationExpire: number;
	bundleId: string;
	providerCredentials: any;
	pnOptions: any;
	apnsProvider: any;

	constructor() {
		const {
			PUSH_NOTIFICATION_EXPIRE = 1,
			APNS_BUNDLE_ID = null,
			APNS_ID = null,
			APNS_TEAM_ID = null,
			APNS_ENVIRONMENT = 'development',
		} = process.env;

		if (!APNS_BUNDLE_ID) {
			throw { type: 500, msg: `Internal Server Error. missing env var 'APNS_BUNDLE_ID'.` };
		}
		if (!APNS_ID) {
			throw { type: 500, msg: `Internal Server Error. missing env var 'APNS_ID'.` };
		}
		if (!APNS_TEAM_ID) {
			throw { type: 500, msg: `Internal Server Error. missing env var 'APNS_TEAM_ID'.` };
		}

		const env = /^production$/.test(APNS_ENVIRONMENT.toLowerCase());
		const certFile = (env) ? 'sawappy.cert.PRODUCTION.p8' : 'sawappy.cert.DEVELOPMENT.p8';
		const apnsCertFilePath = Directories.getPathToFileIfExists('certsPath', certFile);

		if (!apnsCertFilePath) {
			throw { type: 500, msg: `Internal Server Error. unable to find apns cert file: '${Directories.getPathToFile('certsPath', certFile)}'.` };
		}

		this.bundleId = APNS_BUNDLE_ID;
		this.providerCredentials = {
			token: {
				key: apnsCertFilePath,
				keyId: APNS_ID,
				teamId: APNS_TEAM_ID,
			},
			production: env,
		};

		// Default Params
		this.notificationExpire = Math.floor(Date.now() / 1000) + (<number>PUSH_NOTIFICATION_EXPIRE) * 3600;
		this.pnOptions = {
			aps: {
				'content-available': 0
			}
		};

		// apns Provider
		this.apnsProvider = new apn.Provider(this.providerCredentials);
	}

	static getInstance(): ApplePushNotifications {
		return new ApplePushNotifications;
	}

	requestAPS(deviceTokens: string | string[], alert = null, payload: string = null, badge = null, sound = 'ping.aiff'): Promise<any> {
		return new Promise((Resolve, Reject) => {

			if (!deviceTokens) {
				return Reject('deviceToken field is Mandatory!');
			}

			// split on comma char and remove duplicated
			if (typeof deviceTokens === 'string') {
				deviceTokens = deviceTokens.split(',');
			}
			deviceTokens = deviceTokens.filter((v, k, s) => k === s.indexOf(v));

			// if no alert param this PN will be silent
			if (!alert) { this.pnOptions.aps['content-available'] = 1; }

			// parse for optional payload
			const payloadIsJson = (payload && typeof payload === 'string') ? isJson(payload) : null;
			const jsonPayload = (payloadIsJson) ? payloadIsJson : null;

			// Prepare and populate the notification
			const notification = new apn.Notification(this.pnOptions);

			notification.topic = this.bundleId;
			notification.expiry = this.notificationExpire;
			notification.badge = (badge && typeof badge === 'string') ? parseInt(badge, 10) : 1;

			if (alert) {
				notification.alert = alert;
				if (typeof sound === 'string') { notification.sound = sound; }
			}

			if (jsonPayload) { notification.payload = jsonPayload; }

			// Initialize Provider
			const apnsProvider = new apn.Provider(this.providerCredentials);
			// Finally Send the actual notification(s)
			return apnsProvider.send(notification, deviceTokens)
				.then((result) => {
					const timeStamp = moment().format('llll');
					const Res = {
						result: result,
						requestedAt: timeStamp
					};

					if (process.env.NODE_ENV !== 'production') {
						console.log(`Notification: "${(alert) ? alert : 'SILENT Notification'} at: ${timeStamp}`);
					}

					// and Close the server connection
					apnsProvider.shutdown();

					return Res;
				})
				.then(data => Resolve(data))
				.catch(E => Reject(E));
		});
	}

}

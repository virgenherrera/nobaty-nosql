
// as specified in RFC4122
export function isUUIDv4(v: string = ''): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}


export function isEmail(str: string): boolean {
	// General Email Regex(RFC 5322 Official Standard)
	return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(str);
}

export function isJson(str: string): boolean | string {
	try {
		return JSON.parse(str);
	} catch (e) {
		return false;
	}
}

export function areValidCoordinates(val: number[]): boolean {
	const [lng, lat] = val;

	return (lng <= 180 && lng >= -180 && lat <= 90 && lat >= -90) ? true : false;
}

import { registeredRoles } from '../config/roles';

export function roleValidator(val: string): boolean {
	return (registeredRoles.indexOf(val) === -1) ? true : false;
}

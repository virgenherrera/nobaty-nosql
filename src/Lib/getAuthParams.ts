import { ICredentials } from '../Lib/interfaces';

export function getAuthParams(params: any): ICredentials {
	const { token = null, decodedToken = null, user = null } = params;

	if (!token || !decodedToken || !user) {
		throw { type: 401, msg: 'This endpoint can only be consumed by authenticated users.' };
	}

	return { token, decodedToken, user };
}

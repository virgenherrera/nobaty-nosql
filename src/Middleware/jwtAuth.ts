import { Request, Response, NextFunction } from 'express';
import { ReqResHandler } from '../System/ReqResHandler';
import { AuthController } from '../Controller/Auth';
import { authKeys } from '../config/config';

function getTokenFromRequest(req: Request): string {
	const bRegExp = new RegExp('Bearer ', 'g');
	const rawToken = req.body.token ||
		req.query.token ||
		req.query.access_token ||
		req.headers['Authorization'] ||
		req.headers['authorization'] ||
		req.headers['token'] ||
		req.headers['Token'] ||
		req.headers['JWT'] ||
		req.headers['jwt'] ||
		'';

	return rawToken.replace(bRegExp, '');
}

export async function jwtAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
	const handUtil = new ReqResHandler(req, res);
	const token = getTokenFromRequest(req);

	try {
		const data = await AuthController.getInstance().validateAction(token);
		req[authKeys.token] = data.token;
		req[authKeys.decodedToken] = data.decodedToken;
		req[authKeys.user] = data.user;

		return next();
	} catch (E) {
		return handUtil.ErrorJsonResponse(E);
	}
}

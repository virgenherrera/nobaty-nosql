import { Request, Response, NextFunction } from 'express';
import { ReqResHandler } from '../System/ReqResHandler';
import { SessionController } from '../Controller/Session';

export function restJwtAuth() {
	return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
		const handUtil = new ReqResHandler(req, res);
		const ctrl = new SessionController;
		const bRegExp = new RegExp('Bearer ', 'g');
		const rawToken = req.body.token ||
			req.query.token ||
			req.headers.token ||
			req.headers['Authorization'] ||
			req.headers['authorization'] ||
			req.headers['token'] ||
			req.headers['Token'] ||
			req.headers['JWT'] ||
			req.headers['jwt'] ||
			req.cookies.token.token ||
			'';
		const token = (rawToken) ? rawToken.replace(bRegExp, '') : '';

		try {
			const { decodedToken, authenticatedAccount } = await ctrl.validateAction(token);
			req['decodedToken'] = decodedToken;
			req['authenticatedAccount'] = authenticatedAccount;

			return next();
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	};
}

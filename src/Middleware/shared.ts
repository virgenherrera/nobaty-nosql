import { Request, Response, NextFunction } from 'express';
import { ReqResHandler } from '../System/ReqResHandler';
import { SessionController } from '../Controller/Session';

export default class SharedMiddleWares {
	static acceptBodyType(types: string[] = []) {
		return (req: Request, res: Response, next: NextFunction): any => {
			const util = new ReqResHandler(req, res);
			const contentType = req.headers['content-type'] || null;
			let goToNext = false;

			try {
				types.forEach(type => {
					if (contentType.includes(type)) {
						goToNext = true;
					}
				});


				if (goToNext) {
					return next();
				} else {
					throw { type: 406 };
				}

			} catch (E) {
				return util.ErrorJsonResponse(E);
			}
		};
	}

	static routePathNotFound() {
		return (req: Request, res: Response): Response => {
			const message = `Not-existent Endpoint '${req.url}' for Method: '${req.method}'`;

			// return the error JSON Object
			return res.status(404).json({ message });
		};
	}

	static restJwtAuth() {
		return (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
}

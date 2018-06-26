import { Request, Response, NextFunction } from 'express';
import { ReqResHandler } from '../System/ReqResHandler';

export function acceptBodyType(types: string[] = []) {
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

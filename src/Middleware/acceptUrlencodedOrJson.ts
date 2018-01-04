import { Request, Response, NextFunction } from 'express';
import { Error406 } from '../Lib/restDtoResponses';


// allows access without headers only to GET http verb
// and forces content-type': 'application/x-www-form-urlencoded' OR 'application/json' for POST, PUT, DELETE
export function acceptUrlencodedOrJson(req: Request, res: Response, next: NextFunction): any {
	const { method, headers } = req;
	const contentType = headers['content-type'] || null;

	if (method === 'GET') {
		return next();
	}

	if (contentType === 'application/x-www-form-urlencoded' || contentType === 'application/json') {
		return next();
	}

	const e406 = new Error406;
	return res.status(e406.status).json(e406);
}

import { Request, Response, NextFunction } from 'express';
import { Error406 } from '../Lib/restDtoResponses';


// allows access without headers only to GET http verb
// and forces content-type': 'application/json' for POST, PUT, DELETE
export function acceptOnlyJson(req: Request, res: Response, next: NextFunction): any {
	const { method, headers } = req;
	const contentType = headers['content-type'] || null;

	if (contentType === 'application/json') {
		return next();
	}

	const e406 = new Error406('This Endpoint accepts only \'content-type\': \'application/json\'');
	return res.status(e406.status).json(e406);
}

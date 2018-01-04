
import { Request, Response, NextFunction } from 'express';
import { Error404 } from '../Lib/restDtoResponses';

export function notFound(req: Request, res: Response, next: NextFunction): Response {
	const message = `Not-existent Endpoint '${req.url}' for Method: '${req.method}'`;
	const e404 = new Error404(message);

	// set locals, only providing error in development
	res.locals.message = e404.message;
	res.locals.error = (req.app.get('env') === 'development') ? e404 : {};

	// return the error JSON Object
	return res.status(e404.status).json(e404);
}

import { Request, Response } from 'express';

export function routePathNotFound() {
	return (req: Request, res: Response): Response => {
		const message = `Not-existent Endpoint '${req.url}' for Method: '${req.method}'`;

		// return the error JSON Object
		return res.status(404).json({ message });
	};
}

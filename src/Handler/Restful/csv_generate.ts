import { Router, Request, Response, NextFunction } from 'express';
import { IHandler } from '../../Lib/interfaces';
import { HandlerUtility } from '../../Lib/HandlerUtility';
import { restJwtAuth } from '../../Middleware/restJwtAuth';
import { acceptOnlyJson } from '../../Middleware/acceptOnlyJson';
import { CsvGenerateController } from '../../Controller/CsvGenerate';
// only for debugging
// import { dd, dump } from '../../Lib/Debug';

/* csv_generate Handler Class */
class CsvGenerateHandler implements IHandler {

	/**
	* Mandatory Properties Description
	* name:		this Handler's Name
	* path:		the path that this handlerClass will manage
	* router:	the ExpressRouter itself to fill
	*/
	name = 'csv_generate';
	path = `/api/v1/${this.name}`;
	router: Router = Router();

	constructor() {
		// Attach handlers to express Router
		this.router
			.post('/', acceptOnlyJson, restJwtAuth, this.postHandler.bind(this))
			.get('/',  this.getAllHandler.bind( this ) )
			;
	}

	get controller() {
		return new CsvGenerateController;
	}

	async postHandler(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const handUtil = new HandlerUtility(req, res, next);
		const params = handUtil.getRequestParams('body');
		let data;

		try {
			data = await this.controller.createAction(params);
			res.status(200).set({
				'Content-disposition': `attachment; filename=${data.fileName}`,
				'Content-Type': data.mimeType,
				'Content-Length': Buffer.byteLength(data.content, 'utf8'),
			}).write(data.content);

			res.end();

		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}

	async getAllHandler( req: Request, res: Response, next: NextFunction ): Promise<Response> {
		const handUtil = new HandlerUtility(req, res, next);
		const params = handUtil.getRequestParams('query');
		let data;

		try {
			data = await this.controller.listAction(params);
			res.status(200).set({
				'Content-disposition': `attachment; filename=${data.fileName}`,
				'Content-Type': data.mimeType,
				'Content-Length': Buffer.byteLength(data.content, 'utf8'),
			}).write(data.content);

			res.end();
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

export default new CsvGenerateHandler;

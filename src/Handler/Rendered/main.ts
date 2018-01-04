import { Router, Request, Response, NextFunction } from 'express';
import { IHandler } from '../../Lib/interfaces';
import HandlerUtility from '../../Lib/HandlerUtility';
import renderedJwtAuth from '../../Middleware/renderedJwtAuth';
import { UserController } from '../../Controller/User';
// only for debugging
// import { dump } from '../../Lib/Debug';

/* mainHandler Router Class */
class MainHandler implements IHandler {

	/**
	* Mandatory Properties Description
	* name: 	this Handler Name
	* path: 	the path that handles this class
	* router: 	the ExpressRouter itself to fill
	*/
	name = 'main';
	path = `/`;
	router: Router = Router();

	constructor() {
		// Attach handlers to express Router
		this.router
		.get('/', renderedJwtAuth, this.mainView.bind(this));
	}

	get controller() {
		return new UserController;
	}

	async mainView(req: Request, res: Response, next: NextFunction): Promise<any> {
		const handUtil = new HandlerUtility(req, res, next);
		const params = handUtil.getRequestParams('decodedToken');
		let data;

		try {
			data = await this.controller.showAction({id: params.userId});
			data.title = `Hi ${data.first_name}`;

			return res.render('dashboard_example', data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

export default new MainHandler;

import { SessionController as controller } from '../../Controller/Session';
import { Endpoint, RestHandler } from '../../System/decorators';
import { Request, Response, NextFunction } from 'express';
import { HandlerUtility } from '../../Lib/HandlerUtility';
import { RoutePath } from '../../config/routePath';

/* login Handler Class */
@RestHandler
export default class LoginHandler {

	@Endpoint(RoutePath.Login)
	static async post_Login(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const handUtil = new HandlerUtility(req, res, next);
		const params = handUtil.getRequestParams('body');
		let data;

		try {
			data = await controller.getInstance().createAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

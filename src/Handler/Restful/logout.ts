import { Request, Response, NextFunction } from 'express';
import { HandlerUtility } from '../../Lib/HandlerUtility';
import { restJwtAuth } from '../../Middleware/restJwtAuth';
import { SessionController } from '../../Controller/Session';
import { RestHandler, Endpoint } from '../../System/decorators';
import { RoutePath } from '../../config/routePath';

/* Logout Handler Class */
@RestHandler
export default class LogoutHandler {
	@Endpoint(RoutePath.Logout, restJwtAuth)
	static async get_post_logout(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const handUtil = new HandlerUtility(req, res, next);
		const params = handUtil.getRequestParams('authenticatedAccount');
		let data;

		try {
			data = await SessionController.getInstance().destroyAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

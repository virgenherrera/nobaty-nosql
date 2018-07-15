import { Request, Response } from 'express';
import { ReqResHandler } from '../../System/ReqResHandler';
import { jwtAuth } from '../../Middleware/jwtAuth';
import { SessionController } from '../../Controller/Session';
import { RestHandler, Endpoint } from '../../System/decorators';
import { RoutePath } from '../../config/routePath';

/* Logout Handler Class */
@RestHandler
export default class LogoutHandler {
	@Endpoint(RoutePath.Logout, jwtAuth)
	static async get_post_logout(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);
		const params = handUtil.mapReqToObject('authenticatedAccount');
		let data;

		try {
			data = await SessionController.getInstance().destroyAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

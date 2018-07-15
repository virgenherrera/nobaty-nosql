import { SessionController as controller } from '../../Controller/Session';
import { Endpoint, RestHandler } from '../../System/decorators';
import { Request, Response } from 'express';
import { ReqResHandler } from '../../System/ReqResHandler';
import { RoutePath } from '../../config/routePath';

/* login Handler Class */
@RestHandler
export default class LoginHandler {

	@Endpoint(RoutePath.Login)
	static async post_Login(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);
		const params = handUtil.mapReqToObject('body');
		let data;

		try {
			data = await controller.getInstance().createAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

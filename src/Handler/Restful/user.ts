import { Request, Response } from 'express';
import { ReqResHandler } from '../../System/ReqResHandler';
import { jwtAuth } from '../../Middleware/jwtAuth';
import { UserController as controller } from '../../Controller/User';
import { RestHandler, Endpoint } from '../../System/decorators';
import { RoutePath } from '../../config/routePath';

@RestHandler // <- Transform static methods on class on to Express routers
export default class UserHandler {
	@Endpoint(RoutePath.User)
	static async post_user(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);

		try {
			const params = handUtil.mapReqToObject('body');
			const data = await controller.getInstance().createAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}

	@Endpoint(RoutePath.User, jwtAuth)
	static async get_users(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);

		try {
			const params = handUtil.mapReqToObject('query');
			const data = await controller.getInstance().listAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}

	@Endpoint(RoutePath.User_Id, jwtAuth)
	static async get_user(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);

		try {
			const params = handUtil.mapReqToObject('params');
			const data = await controller.getInstance().showAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);

		}
	}

	@Endpoint(RoutePath.User_Id, jwtAuth)
	static async put_user(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);

		try {
			const params = handUtil.mapReqToObject('params,body');
			const data = await controller.getInstance().editAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);

		}
	}

	@Endpoint(RoutePath.User_Id, jwtAuth)
	static async delete_user(req: Request, res: Response): Promise<Response> {
		const handUtil = new ReqResHandler(req, res);

		try {
			const params = handUtil.mapReqToObject('params');
			const data = await controller.getInstance().deleteAction(params);
			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

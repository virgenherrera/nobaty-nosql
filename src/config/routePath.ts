import { basePath, apiV1Path } from '../System/decorators';

export class RoutePath {
	// baseValue for basePath decorator
	public static BASE_PATH = '/';

	// base value for apiV1Path decorator
	public static API_V1_PATH = '/api/v1/';

	@basePath() public static VIEW_LOGIN = 'login';

	@apiV1Path() public static Login = 'login';
	@apiV1Path() public static Logout = 'logout';
}

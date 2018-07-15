import { basePath, apiV1Path } from '../System/decorators';

export class RoutePath {
	// baseValue for basePath decorator
	public static BASE_PATH = '/';

	// base value for apiV1Path decorator
	public static API_V1_PATH = '/api/v1/';

	@basePath() public static VIEW_LOGIN = 'login';

	@apiV1Path() public static System_Health = 'system/health';
	@apiV1Path() public static System_Logs = 'system/logs';

	@apiV1Path() public static Login = 'login';
	@apiV1Path() public static Logout = 'logout';

	@apiV1Path() public static User = 'users';
	@apiV1Path() public static User_Id = 'users/:id';
}

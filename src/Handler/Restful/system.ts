import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';
import Directories from '../../Lib/Directories';
import { HandlerUtility } from '../../Lib/HandlerUtility';
import { RestHandler, Endpoint } from '../../System/decorators';
import { RoutePath } from '../../config/routePath';

@RestHandler // <- Transform static methods on class on to Express routers
export default class SystemLogsHandler {
	@Endpoint(RoutePath.System_Health)
	static async get_post_system_health(req: Request, res: Response, next: NextFunction): Promise<Response> {
		const handUtil = new HandlerUtility(req, res, next);

		try {
			const uptime = process.uptime();
			const humanUptime = moment.duration({ seconds: uptime }).humanize();
			const uptimeSince = moment().subtract(uptime, 'seconds').format('YYYY/MMMM/DD hh:mm:ss A UTC:ZZ');
			const data = { uptime, humanUptime, uptimeSince };

			return handUtil.SuccessJsonResponse(data);
		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}

	@Endpoint(RoutePath.System_Logs)
	static async get_post_system_logs(req: Request, res: Response, next: NextFunction): Promise<any> {
		const { LOGS_USER, LOGS_PASS } = process.env;
		const handUtil = new HandlerUtility(req, res, next);
		const { username = null, password = null, file = 'forever', render = false } = handUtil.getRequestParams('headers,body,query');

		try {
			const logFiles = Directories.readDir('logsPath', true);
			const logFile = (logFiles.indexOf(file) === -1) ? 'forever.log' : `${file}.log`;

			if ((LOGS_USER !== username) && (LOGS_PASS !== password)) {
				throw { type: 401, msg: 'Bad Credentials' };
			}

			if (render) {
				return res.status(200).sendFile(Directories.getPathToFile('logsPath', logFile));
			}

			const data = Directories.getFileContents('logsPath', logFile);
			res.status(200).set({
				'Content-disposition': `attachment; filename=${logFile}`,
				'Content-Type': 'text/plain',
				'Content-Length': Buffer.byteLength(data, 'utf8'),
			}).write(data);

			return res.end();

		} catch (E) {
			return handUtil.ErrorJsonResponse(E);
		}
	}
}

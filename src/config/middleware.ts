import * as logger from 'morgan';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

/**
* The application's global middleware stack.
*
* These middleware are run during every request to your application.
*
* Add to this array all middlewares that you wish to use globally
*/

export const middleware = [
	logger('dev'),
	cors(),
	bodyParser.json({ strict: true }),
	bodyParser.urlencoded({ extended: true }),
];

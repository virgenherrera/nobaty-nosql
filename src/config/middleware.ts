import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import acceptUrlencodedOrJson from '../Middleware/acceptUrlencodedOrJson';

/**
* The application's global middleware stack.
*
* These middleware are run during every request to your application.
*
* Add to this array all middlewares that you wish to use globally
*/

export const middleware = [
	logger('dev'),
	bodyParser.json({strict: true}),
	bodyParser.urlencoded({ extended: false }),
	cookieParser(),
	cors(),
	acceptUrlencodedOrJson,
];

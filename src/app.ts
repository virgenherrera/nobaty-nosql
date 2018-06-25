import * as Express from 'express';
import * as favicon from 'serve-favicon';
import * as Handlers from './config/handler';
import { loadEnvironmentVars } from './Lib/loadEnvironmentVars';
import Directories from './Lib/Directories';
import { mongooseConnection } from './Lib/mongooseConnection';
import { notFound } from './Middleware/notFound';
import { middleware } from './config/middleware';
import { USE_DATA_PERSISTENCE } from './config/config';

// Create and config a new expressJs web Application
class Application {

	public express: Express.Application;

	constructor() {
		/**
		* Be sure to execute this App with properly defined ENV
		*/
		loadEnvironmentVars();

		// Initialize Express js app
		this.express = Express();

		if (USE_DATA_PERSISTENCE) {
			this.storageConnect();
		} else {
			console.log(`	/* Omitting the data storage layer */`);
			console.log(`if you wish to activate it, change the value of "USE_DATA_PERSISTENCE" to true in ./src/config/config.ts`);
		}

		this
			.serveFavicon()
			.middleware()
			.viewsConfig()
			.exposePubicPath()
			.exposeRoutes()
			.catch404()
			;
	}

	serveFavicon(): this {
		this.express.use(
			favicon(
				Directories.getPathToFile('publicPath', 'favicon.ico')
			)
		);

		return this;
	}

	middleware(): this {
		middleware.forEach(mid => {
			this.express.use(mid);
		});

		return this;
	}

	viewsConfig(): this {
		// view engine setup
		this.express.set('views', Directories.viewsPath);
		this.express.set('view engine', 'pug');

		return this;
	}

	exposePubicPath(): this {
		this.express.use(Express.static(Directories.publicPath));

		return this;
	}

	exposeRoutes() {
		console.log(`${'\n'}`);
		console.log(`Loading Handlers from: '${Directories.getPathToFile('configPath', 'handler.ts')}' file.`);

		for (const key in Handlers) {
			if (Handlers.hasOwnProperty(key)) {
				const { name = null, router = null } = Handlers[key];
				if (name && router) {
					this.express.use(router);
					console.log(` Using handler: '${name}' from: '${key}' config element.`);
				}
			}
		}

		console.log(`${'\n'}`);
		return this;
	}

	catch404(): this {
		// catch 404 and handle it
		this.express.use(notFound);

		return this;
	}

	async storageConnect(): Promise<void> {
		const msg = await mongooseConnection();
		console.log(msg);
	}
}

const { express } = new Application;
export const app = express;

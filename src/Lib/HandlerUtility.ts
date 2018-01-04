// import { dd } from '../Lib/Debug';
import { Request, Response, NextFunction } from 'express';
import pagination from '../config/pagination';
import {
	Auth,
	Get,
	Post,
	Put,
	Delete,
	Error400,
	Error401,
	Error500
} from './restDtoResponses';

export class HandlerUtility {

	req: Request;
	res: Response;
	next: NextFunction;

	_limit: number;
	_offset: number;

	constructor(req: Request, res: Response, next: NextFunction) {
		this.req = req;
		this.res = res;
		this.next = next;

		const { query = {} } = req;
		const { limit = -1, offset = -1 } = query;

		// set limit AND offset from query
		this.limit = limit;
		this.offset = offset;
	}

	set limit(limit: number) {
		if (typeof limit === 'number' || (typeof limit === 'string' && /^\d+$/.test(limit))) {
			// parse int
			limit = Number(limit);
			// allow MAX limit to defined in constants file
			this._limit = (limit > 0 && limit < pagination.limit) ? limit : pagination.limit;
		}
	}

	set offset(offset: number) {
		if (typeof offset === 'number' || (typeof offset === 'string' && /^\d+$/.test(offset))) {
			// parse int
			offset = Number(offset);
			// offset must be Major than 0
			this._offset = (offset > 0) ? offset : pagination.offset;
		}
	}

	get limit(): number {
		return Number(this._limit);
	}

	get offset(): number {
		return Number(this._offset);
	}

	get sort(): object {
		const { query = {} } = this.req;
		const { sort = '' } = query;
		const Res = {};

		const parsed = sort
			.split(',')
			.forEach((item: string) => {
				if (!item) { return; }
				let order = 'asc';
				if (item.charAt(0) === '-') {
					order = 'desc';
					item = item.substring(1);
				}

				Res[item] = order;
			});

		return Res;
	}

	public getRequestParams(paramString: string | string[]): any {
		const Req = this.req;
		let params = [{}];

		if (typeof paramString === 'string') {
			paramString = paramString.split(',');
		}

		const reqParamsArr = paramString
			.map((p) => {
				if (p in Req) {
					return (typeof Req[p] === 'object') ? Req[p] : { [p]: Req[p] };
				}
			});
		params = params.concat(reqParamsArr);
		if (Req.method === 'GET') {
			params.push({ limit: this.limit, offset: this.offset, sort: this.sort });
		}

		return (<any>Object).assign.apply(this, params);
	}

	public httpMethodOverride(method: string): void {
		this.req.method = method;
	}

	public SuccessJsonResponse(params): Response {
		const { method } = this.req;
		const Res = this.res;
		let Data;

		switch (method) {
			case 'GET':
				Data = new Get(params);
				break;
			case 'POST':
				Data = new Post(params);
				break;

			case 'PUT':
				Data = new Put(params);
				break;

			case 'DELETE':
				Data = new Delete(params);
				break;

			case 'LOGIN':
				Data = new Auth(params);
				break;
		}

		return Res.status(Data.status).json(Data);
	}

	public ErrorJsonResponse(params): Response {
		const { method } = this.req;
		const Res = this.res;
		const {
			name = null,
			message = null
		} = params;
		let Err;
		if (method === 'LOGIN' || name === 'JsonWebTokenError') {
			Err = new Error401(params);
		} else if (message) {
			Err = new Error400(params.message);
		} else {
			Err = new Error500(params);
		}

		return Res.status(Err.status).json(Err);
	}
}

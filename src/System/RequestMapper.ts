import { Request, Response } from 'express';
import { Config } from '../config';
import * as restDto from './restDto';


export class HandlerUtilities {
	constructor(private req: Request, private res: Response) { }

	get page(): number {
		let { page = null } = this.req.query;

		if (!page) {
			page = Config.Paging.page;
		} else if (page && !/^\d+$/.test(page)) {
			const Ex = { type: 400, message: `The query parameter 'page' is present but is not a positive integer.` };
			throw this.ErrorJsonResponse(Ex);
		}

		return Number(page);
	}

	get per_page(): number {
		let { per_page = null } = this.req.query;

		if (!per_page) {
			per_page = Config.Paging.per_page;
		} else if (per_page && !/^\d+$/.test(per_page)) {
			const Ex = { type: 400, message: `The query parameter 'per_page' is present but is not a positive integer.` };
			throw this.ErrorJsonResponse(Ex);
		}

		return Number(per_page);
	}

	get sort(): object {
		const { sort = '' } = this.req.query;

		return sort
			.split(',')
			.reduce((acc, item: string) => {
				let order;

				if (item && item.charAt(0) !== '-') {
					order = 'asc';

					acc[item] = order;
				} else if (item && item.charAt(0) === '-') {
					order = 'desc';
					item = item.substring(1);

					acc[item] = order;
				}

				return acc;
			}, {});
	}

	public mapReqToObject(paramString: string | string[]): any {
		if (typeof paramString === 'string') {
			paramString = paramString.split(',').filter(v => v);
		}

		const reqParamsArr = paramString
			.map((key) => {
				if (this.req.hasOwnProperty(key)) {
					return (typeof this.req[key] === 'object') ? this.req[key] : { [key]: this.req[key] };
				}
			});
		const params = [{}].concat(reqParamsArr);

		// Inject page, per_page and sort if method is GET
		if (this.req.method === 'GET') {
			params.push({ page: this.page, per_page: this.per_page, sort: this.sort });
		}

		return Object.assign({}, ...params);
	}

	public SuccessJsonResponse(data: any, responseOverride: string = null): Response {
		let { method } = this.req;
		let Data;

		if (responseOverride) {
			method = responseOverride;
		}

		method = method.toUpperCase();

		switch (method) {
			case 'GET':
				Data = new restDto.Http200(data);
				break;
			case 'POST':
				Data = new restDto.Http201(data);
				break;

			case 'PUT':
				Data = new restDto.Http200(Object.assign({}, data, { method: method }));
				break;

			case 'DELETE':
				Data = new restDto.Http200(Object.assign({}, data, { method: method }));
				break;
			case '204':
				Data = new restDto.Http204;
				break;

			default:
				Data = new restDto.Http200(data);
				break;
		}

		const { status } = Data;
		delete Data.status;

		return this.res.status(status).json(Data);
	}

	public ErrorJsonResponse(Exception: any, exceptionOverride: number = null): Response {
		let { type } = Exception;
		let Err;

		if (exceptionOverride) {
			type = exceptionOverride;
		}

		type = parseInt(type, 10);

		switch (type) {
			case 400:
				Err = new restDto.Http400(Exception);
				break;
			case 401:
				Err = new restDto.Http401(Exception);
				break;
			case 403:
				Err = new restDto.Http403(Exception);
				break;
			case 404:
				Err = new restDto.Http404;
				break;
			case 406:
				Err = new restDto.Http406(Exception);
				break;
			case 500:
				Err = new restDto.Http500(Exception);
				break;
			default:
				Err = new restDto.Http500(Exception);
				break;
		}

		const { status } = Err;
		delete Err.status;

		return this.res.status(status).json(Err);
	}
}

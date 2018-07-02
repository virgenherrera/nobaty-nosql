import { Request, Response } from 'express';
import * as restDto from './restDto';


export class ReqResHandler {
	constructor(private req: Request, private res: Response) { }

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

		return Object.assign({}, ...reqParamsArr);
	}

	public SuccessJsonResponse(data: any, responseOverride: string = null): any {
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

	public ErrorJsonResponse(Exception: any, exceptionOverride: number = null): any {
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

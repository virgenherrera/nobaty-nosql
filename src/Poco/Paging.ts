import { Request } from 'express';
import { stringify } from 'querystring';

export class Paging {
	public count: number;
	public prev: string | null;
	public next: string | null;

	constructor(params: any = {}, req: Request) {
		const { headers, originalUrl } = req;
		const { sort = '', } = req.query;
		const { page, per_page } = params;
		const count = parseInt(params.count, 10) || 0;
		const baseUrl = `${headers.host}${originalUrl.split('?').shift()}`;
		let prevUrl = null;
		let nextUrl = null;

		if (page > 1) {
			const segments: any = {};
			segments.page = page - 1;
			segments.per_page = per_page;

			if (sort) { segments.sort = sort; }

			prevUrl = `${baseUrl}?${stringify(segments)}`;
		}

		if ((page * per_page) < count) {
			const segments: any = {};
			segments.page = page + 1;
			segments.per_page = per_page;

			if (sort) { segments.sort = sort; }

			nextUrl = `${baseUrl}?${stringify(segments)}`;
		}

		this.count = count;
		this.prev = prevUrl;
		this.next = nextUrl;
	}
}

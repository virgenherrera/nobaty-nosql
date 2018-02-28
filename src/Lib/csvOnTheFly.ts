import * as CSV from 'fast-csv';
import { v4 } from 'uuid';
import * as mime from 'mime';
import Directories from '../Lib/Directories';

export function csvOnTheFly(filename: string = null, data: any[]): Promise<any> {
	return new Promise((Resolve, Reject) => {
		const fileName = (filename) ? filename : `${v4()}.csv`;
		const mimeType = 'text/csv';
		let content;

		return CSV.writeToString(data, { headers: true, delimiter: ',', quote: '"', quoteColumns: true }, (err, csvStr) => {
			if (err) {
				console.error(err);
				return Reject(err);
			}

			content = csvStr;

			return Resolve({ fileName, mimeType, content });
		}
		);
	});
}

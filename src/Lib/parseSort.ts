export function parseSort(args): any {
	const { sort = '' } = args;
	const sortObject = sort
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

	args['sort'] = sortObject;

	return args;
}

import { createWriteStream } from 'fs';
import { resolve } from 'url';
import * as CSV from 'fast-csv';
import Directories from '../Lib/Directories';
import { TenantRepository } from '../Repository/Tenant';
import { GeneratedRepository } from '../Repository/Generated';

export async function csvWriter(tenant_id: string = null, filename: string, data: any[]): Promise<any> {

	// go find siteDomain on Tenant
	const Tenant = new TenantRepository;
	const tenant = await Tenant.FindOne({ tenant_id }, 'includeSites');
	const { sites = [] } = tenant;
	const firstSite = sites.shift();
	const domain = (firstSite.domain) ? firstSite.domain : '';

	// create full file path
	const filePath = Directories.getPathToFile('publicGeneratedCustomersPath', filename);

	// prepare customers
	const rows = data.map(({ id, email = null }, i) => {
		const row = {
			row: i + 1,
			id: id,
			url: resolve(domain, `/home/${id}`),
		};

		// append email field only  if exist
		if (email) {
			row['email'] = email;
		}

		return row;
	});

	// Create file stream fo file
	const fileStream = createWriteStream(filePath);

	// Write data to Stream
	await CSV.write(rows, { headers: true, delimiter: ',', quote: '"', quoteColumns: true }).pipe(fileStream);

	//
	const genRepository = new GeneratedRepository;
	return await genRepository.Create({ tenantId: tenant_id, filename });
}

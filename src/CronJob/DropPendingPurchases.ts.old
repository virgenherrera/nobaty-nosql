import { CronJob } from 'cron';
import { PurchaseModel } from '../Model/Purchase';

export function DropPendingPurchases(): CronJob {
	const pastDate = new Date(new Date().setDate((new Date).getDate() - 3));
	const queryArgs = {
		paymentMethod: 'oxxo_cash',
		status: 'pending_payment',
		createdAt: {
			'$lte': pastDate
		},
	};

	try {
		return new CronJob({
			cronTime: '59 59 23 * * 1-7',
			onTick: async () => await PurchaseModel.remove(queryArgs).exec(),
			onComplete: () => console.log('Finished CronJob: DropPendingPurchases'),
			start: true,
		});
	} catch (E) {
		console.log(E);
	}
}

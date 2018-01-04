import { User } from '../Model/User';
import { SessionHistory } from '../Model/SessionHistory';
import { IFindOne, ICreate, IDelete } from '../Lib/interfaces';
import { validatePassword } from '../Lib/passwordUtil';
// only for debugging
// import { dd } from '../Lib/Debug';

export class SessionRepository implements IFindOne, ICreate, IDelete {
	async FindOne(params, scope: string = 'default'): Promise<any> {
		const Wh = {
			where: {
				id: params.historyId,
				logout: null,
				user_id: params.userId,
			},
			// include: [{
			// 	attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
			// 	model: User,
			// 	required: true,
			// }]
		};

		const data = await SessionHistory.scope( scope ).findOne(Wh);
		if ( !data ) {
			throw new Error('your token has expired');
		}

		return data;
	}

	async Create({ email = null, password = null }): Promise<any> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			throw new Error(`Non-existent email: ${email}`);
		}
		if (!validatePassword(password, user.password)) {
			throw new Error(`bad credentials`);
		}

		const history = await SessionHistory.create({ user_id: user.id });

		return {
			userId: user.id,
			role: user.role,
			historyId: history.id,
		};
	}

	async Delete(params): Promise<any> {
		const Wh = {
			where: {
				id: params.historyId,
			}
		};

		const data = await SessionHistory.update({logout: new Date}, Wh );

		return (data);
	}
}

import { sign, verify } from 'jsonwebtoken';
import { IcreateAction } from '../Lib/interfaces';
import { SessionRepository } from '../Repository/Session';
import { Session } from '../Poco/session';
// only for debugging
// import { dd } from '../Lib/Debug';

/* Session Controller Class */
export class SessionController implements IcreateAction {
	secret: string	= process.env.JWT_SECRET;
	options: object	= { expiresIn: process.env.JWT_EXPIRATION };

	get repository() {
		return new SessionRepository;
	}

	async createAction(params): Promise<any> {
		const data = await this.repository.Create(params);

		return {
			token: sign(data, this.secret, this.options)
		};
	}

	async validateAction(token: string): Promise<any> {
		let decodedToken;

		try {
			decodedToken = verify(token, this.secret);
			const data = await this.repository.FindOne(decodedToken);

			return new Session( decodedToken );

		} catch (E) {
			throw E;
		}
	}

	async destroyAction(params): Promise<any> {
		return await this.repository.Delete(params);
	}
}

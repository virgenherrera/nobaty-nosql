import { sign, verify } from 'jsonwebtoken';
import { validatePassword } from '../Lib/passwordUtil';
import { IcreateAction } from '../Lib/interfaces';
import { UserRepository } from '../Repository/user';
import { User } from '../Poco/user';
// only for debugging
// import { dd } from '../Lib/Debug';

/* Session Controller Class */
export class SessionController implements IcreateAction {
	secret: string = process.env.JWT_SECRET;
	options: object = { expiresIn: process.env.JWT_EXPIRATION };

	get repository() {
		return new UserRepository;
	}

	async createAction({ email = null, password = null }): Promise<any> {
		const data = await this.repository.FindOne({ email }, 'email password role');

		if (!data) { throw new Error(`Non-existent email: ${email}`); }
		if (!validatePassword(password, data.password)) { throw new Error(`bad credentials`); }

		const jwtPayload = {
			id: data._id,
			role: data.role
		};

		return {
			token: sign(jwtPayload, this.secret, this.options)
		};
	}

	async validateAction(token: string): Promise<any> {
		let decodedToken;
		try {
			decodedToken = verify(token, this.secret);
			const Wh = {
				_id: decodedToken.id,
				role: decodedToken.role,
			};
			const data = await this.repository.FindOne(Wh, 'email role');

			return new User(data);
		} catch (e) {
			throw e;
		}
	}

	async destroyAction(params): Promise<any> {
		return true;
	}
}

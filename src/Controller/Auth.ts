import { sign, verify } from 'jsonwebtoken';
import { validatePassword } from '../Lib/passwordUtil';
import { UserRepository } from '../Repository/user';
import { ICredentials } from '../Lib/interfaces';
// only for debugging
// import { dd } from '../Lib/Debug';

/* Auth Controller Class */
export class AuthController {
	secret: string = process.env.JWT_SECRET;
	options = { expiresIn: process.env.JWT_EXPIRATION };

	static getInstance(): AuthController {
		return new AuthController();
	}

	async createAction({ email = null, password = null }): Promise<any> {
		const user = await UserRepository.getInstance().FindOne({ email }, 'email password role');

		if (!validatePassword(password, user.password)) {
			throw { type: 400, msg: 'bad credentials' };
		}

		const jwtPayload = {
			id: user.id,
		};

		return {
			token: sign(jwtPayload, this.secret, this.options)
		};
	}

	async validateAction(token: string): Promise<ICredentials> {
		let decodedToken;
		try {
			decodedToken = verify(token, this.secret);
			const user = await UserRepository.getInstance().GetById({ id: decodedToken.id });

			return { token, decodedToken, user };
		} catch (e) {
			throw { type: 401, msg: e };
		}
	}

	async destroyAction(params): Promise<any> {
		return params;
	}
}

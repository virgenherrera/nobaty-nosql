import { sign } from 'jsonwebtoken';
import { loadEnvironmentVars } from '../src/Lib/loadEnvironmentVars';

export function generateUserToken(id: string, role: string): string {
	loadEnvironmentVars();

	const jwtPayload = {
		id: id,
		role: role
	};
	return sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

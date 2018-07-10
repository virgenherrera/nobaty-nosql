import { sign } from 'jsonwebtoken';
import { loadEnvironmentVars } from '../src/Lib/loadEnvironmentVars';
import { preloadedFixtures } from './fixtures/userFixtures';

export function generateToken(id: string, role: string): string {
	loadEnvironmentVars();

	const jwtPayload = {
		id: id,
		role: role
	};
	return sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

export function createAccessToken(userIndex: number = 0): string {
	const { _id, role } = (typeof preloadedFixtures[userIndex] === 'undefined') ? preloadedFixtures[userIndex] : preloadedFixtures.shift();

	return generateToken(_id, role);
}

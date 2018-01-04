import { hashSync, genSaltSync, compareSync } from 'bcryptjs';

export function obfuscatePassword( rawPass: string, rounds: number = 12 ): string {
	const salt = genSaltSync( rounds );
	return hashSync( rawPass, salt );
}

export function validatePassword( rawPass: string, hashPass: string ): boolean {
	return compareSync( rawPass, hashPass );
}

import { Types } from 'mongoose';

const splitRegex = /-|_| |\/|\\/;

// transforms the first letter of the string in lowercase
export function lcFirst(str: string): string {
	return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
}

// transforms the first letter of the string in uppercase
export function ucFirst(str: string): string {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function toCamelCase(str: string, ucF: boolean = false): string {
	return str
		.split(splitRegex)
		.filter(v => (v))
		.map((v, k) => (k === 0 && ucF) ? lcFirst(v) : ucFirst(v))
		.join('');
}

export function to_snake_case(str: string, ucF: boolean = false): string {
	return str
		.split(splitRegex)
		.filter(v => (v))
		.map((v) => (ucF) ? ucFirst(v) : v.toLowerCase())
		.join('_');
}

export function TO_CONSTANT_CASE(str: string): string {
	return str
		.split(splitRegex)
		.filter(v => (v))
		.map((v) => v.toUpperCase())
		.join('-');
}

export function ToTitleCase(str: string, glue: string = ' '): string {
	return str
		.split(splitRegex)
		.filter(v => (v))
		.map((v) => ucFirst(v))
		.join(glue);
}

export function formatString(number: number | string, mask: string = '0000-0000-0000-00'): string {
	const replacer = mask.charAt(0);
	const str = number.toString();
	let res = '';

	for (let iMask = 0, iStr = 0; iMask < mask.length && iStr < str.length; iMask++) {
		res += (mask.charAt(iMask) === replacer) ? str.charAt(iStr++) : mask.charAt(iMask);
	}

	return res;
}

export function ObjectId() {
	return `${Types.ObjectId()}`;
}

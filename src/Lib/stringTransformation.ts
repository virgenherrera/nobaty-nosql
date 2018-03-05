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
		.map((v, k) => (k === 0 && !ucF) ? lcFirst(v) : ucFirst(v))
		.join('');
}

export function to_snake_case(str: string, ucF: boolean = false): string {
	return str
		.split(splitRegex)
		.filter(v => (v))
		.map((v) => (ucF) ? ucFirst(v) : v.toLowerCase())
		.join('-');
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
		.map((v, k) => ucFirst(v))
		.join(glue);
}

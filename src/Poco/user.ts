// only for debugging
// import { dd } from '../Lib/Debug';

export default class User {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	role: string;

	constructor(params= null) {
		this.id = params.id;
		this.first_name = params.first_name;
		this.last_name = params.last_name;
		this.email = params.email;
		this.password = params.password;
		this.role = params.role;
	}
}

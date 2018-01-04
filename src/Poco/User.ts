// only for debugging
// import { dd } from '../Lib/Debug';

export class User {
	public id: string;
	public name: string;
	public last_name: string;
	public email: string;
	public password: string;
	public role: string;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(params = null) {
		this.id = params.id;
		this.name = params.name;
		this.last_name = params.last_name;
		this.email = params.email;
		this.password = params.password;
		this.role = params.role;
		this.createdAt = params.createdAt;
		this.updatedAt = params.updatedAt;
	}
}

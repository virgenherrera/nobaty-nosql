import { IUser } from '../Model/User';
import { UserSchema } from '../Dto/User';
import { schemaValidator } from '../Lib/schemaValidator';
// only for debugging
// import { dd } from '../Lib/Debug';

export class User implements IUser {
	public id;
	public name;
	public lastName;
	public email;
	public password;
	public role;
	public createdAt;
	public updatedAt;

	constructor(params: any = {}, validateDto = false) {
		if (validateDto) {
			params = schemaValidator(params, UserSchema, true);
		}

		this.id = params.id || `${params._id}`;
		this.name = params.name;
		this.lastName = params.lastName;
		this.email = params.email;
		this.password = params.password;
		this.role = params.role;
		this.createdAt = params.createdAt;
		this.updatedAt = params.updatedAt;
	}
}

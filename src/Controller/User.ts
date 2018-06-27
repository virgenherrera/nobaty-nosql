import { ICrudController } from '../Lib/interfaces';
import { IGetAllUser, UserRepository } from '../Repository/User';
import { User } from '../Poco/User';
import { schemaValidator } from '../Lib/schemaValidator';
import { newUserSchema, updateUserSchema } from '../Dto/User';
// only for debugging
// import { dd, dump , die } from '../Lib/Debug';

/* User Controller Class */
export class UserController implements ICrudController {
	static getInstance(): UserController {
		return new UserController;
	}

	async createAction(params: any): Promise<any> {
		const dto = schemaValidator(params, newUserSchema, true);
		const poco = new User(dto);
		const user = await UserRepository.getInstance().Create(poco);

		user.password = 'private';

		return user;
	}

	async editAction(params: any): Promise<User> {
		const dto = schemaValidator(params, updateUserSchema, true);
		const poco = new User(dto);
		const user = await UserRepository.getInstance().Update(poco);

		user.password = 'private';

		return user;
	}

	async listAction(params: any): Promise<IGetAllUser> {
		return await UserRepository.getInstance().GetAll(params);
	}

	async showAction(params: any): Promise<User> {
		const dto = schemaValidator(params, updateUserSchema, true);

		return await UserRepository.getInstance().GetById(dto);
	}

	async deleteAction({ id }): Promise<User> {
		return await UserRepository.getInstance().Delete({ id });
	}
}

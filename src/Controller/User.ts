import { ICrudController } from '../Lib/interfaces';
import { IGetAllUser, UserRepository } from '../Repository/User';
import { User } from '../Poco/User';
import { schemaValidator } from '../Lib/schemaValidator';
import { newUserSchema, updateUserSchema } from '../Dto/User';
import { findEntitySchema, listEntitySchema } from '../Dto/globalService';
import { parseSort } from '../Lib/parseSort';
// only for debugging
// import { dd, dump, die } from '../Lib/Debug';

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
		const query = parseSort(poco);
		const user = await UserRepository.getInstance().Update(query);

		user.password = 'private';

		return user;
	}

	async listAction(params: any): Promise<IGetAllUser> {
		const dto = schemaValidator(params, listEntitySchema, true);

		return await UserRepository.getInstance().GetAll(dto);
	}

	async showAction(params: any): Promise<User> {
		const dto = schemaValidator(params, findEntitySchema, true);

		return await UserRepository.getInstance().GetById(dto);
	}

	async deleteAction(params): Promise<User> {
		const dto = schemaValidator(params, findEntitySchema, true);

		return await UserRepository.getInstance().Delete(dto);
	}
}

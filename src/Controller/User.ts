import { ICrudController } from '../Lib/interfaces';
import { IGetAllUser, UserRepository } from '../Repository/User';
import { User } from '../Poco/User';
// only for debugging
// import { dd, dump , die } from '../Lib/Debug';

/* User Controller Class */
export class UserController implements ICrudController {
	static getInstance(): UserController {
		return new UserController;
	}

	async createAction(params: any): Promise<any> {
		const poco = new User(params, true);

		return await UserRepository.getInstance().Create(poco);
	}

	async editAction(params: any): Promise<User> {
		const poco = new User(params, true);

		return await UserRepository.getInstance().Update(poco);
	}

	async listAction(params: any): Promise<IGetAllUser> {
		return await UserRepository.getInstance().GetAll(params);
	}

	async showAction(params: any): Promise<User> {
		return await UserRepository.getInstance().GetById(params);
	}

	async deleteAction({ id }): Promise<User> {
		return await UserRepository.getInstance().Delete({id});
	}
}

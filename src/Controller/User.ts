import { IcrudController } from '../Lib/interfaces';
import { UserRepository } from '../Repository/User';
import User from '../Poco/user';
// only for debugging
// import {dd} from '../Lib/Debug';

/* user Controller Class */
export class UserController implements IcrudController {

	get repository() {
		return new UserRepository;
	}

	async createAction(params): Promise<any> {
		const Entity	= new User(params);
		const data	= await this.repository.Create(Entity);

		const Res = new User( data );
		delete Res.password;
		return Res;
	}

	async listAction(params): Promise<any> {
		const {limit, offset} = params;
		const data = await this.repository.GetAll(params);

		data.rows = data.rows.map( row => new User(row) );
		const {count, rows} = data;

		return {count, rows, limit, offset};
	}

	async showAction(params): Promise<any> {
		let data	= await this.repository.GetById(params);
		data		= (data) ? new User(data) : null;

		return data;
	}

	async editAction(params): Promise<any> {
		const data = await this.repository.Update(params);

		return new User(data);
	}

	async deleteAction({id}): Promise<any> {
		return await this.repository.Delete(id);
	}
}

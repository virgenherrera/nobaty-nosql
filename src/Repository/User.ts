import { User } from '../Model/User';
import { IfullRepository } from '../Lib/interfaces';
// only for debugging
// import { dd } from '../Lib/Debug';

export class UserRepository implements IfullRepository {
	async GetById({ id = null, scope = 'default' }): Promise<any> {
		return await User.scope( scope ).findById(id);
	}

	async FindOne(params, scope: string = 'default'): Promise<any> {
		return await User.scope( scope ).findOne(params);
	}

	async GetAll({ where = {}, limit = null, offset = null, sort = [], scope = 'default' }): Promise<any> {
		const Wh = {where, limit, offset, order: sort};

		return await User.scope( scope ).findAndCountAll(Wh);
	}

	async Create(params): Promise<any> {
		return await User.create(params);
	}

	async Update(params): Promise<any> {
		const {
			id = null,
			first_name = null,
			last_name = null,
			email = null,
			password = null,
			role = null,
		} = params;
		const Entity = await User.findById(id);

		if (!Entity) { return `non-existent Entity with id: ${id}`; }

		if (first_name) { Entity.first_name = first_name; }
		if (last_name) { Entity.last_name = last_name; }
		if (email) { Entity.email = email; }
		if (password) { Entity.password = password; }
		if (role) { Entity.role = role; }

		return await Entity.save();
	}

	async Delete(id): Promise<any> {
		const Wh = {
			where: {id}
		};
		return await User.destroy(Wh);
	}
}

import { UserModel } from '../Model/user';
import { IfullRepository } from '../Lib/interfaces';
// only for debugging
// import { dd } from '../Sys/Debug';

export class UserRepository implements IfullRepository {
	async GetById({ id = null }): Promise<any> {
		return await UserModel.findById(id).exec();
	}

	async FindOne(params, fields = null): Promise<any> {
		return await UserModel.findOne(params, fields).exec();
	}

	async GetOne({ id = null }): Promise<any> {
		return await UserModel.findById(id).exec();
	}

	async GetAll({ limit, offset, sort = {} }): Promise<any> {
		// Important to return Total count
		// do not forget to include!!!!
		const count = await UserModel.count({}).exec();
		const rows = await UserModel
			.find()
			.skip(offset)
			.limit(limit)
			.sort(sort)
			.exec();

		return { count, rows };
	}

	async Create(params): Promise<any> {
		const preparedEntity = new UserModel(params);
		const storedEntity = await preparedEntity.save();

		// to avoid bubble private chars
		return await UserModel.findById(storedEntity).exec();
	}

	async Update(params): Promise<any> {
		const {
			id = null,
			name = null,
			last_name = null,
			email = null,
			password = null,
			role = null,
		} = params;
		const Entity = await UserModel.findById(id).exec();

		if (!Entity) {
			return `non-existent Entity with id: ${id}`;
		}

		if (name) { Entity.name = name; }
		if (last_name) { Entity.last_name = last_name; }
		if (email) { Entity.email = email; }
		if (password) { Entity.password = password; }
		if (role) { Entity.role = role; }

		return await Entity.save();
	}

	async Delete({ id }): Promise<any> {
		return await UserModel.remove({ _id: id }).exec();
	}
}

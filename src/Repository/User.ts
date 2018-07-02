import { UserModel as Model } from '../Model/User';
import { User as pocoUser } from '../Poco/User';
import { IFullRepository } from '../Lib/interfaces';
// only for debugging
// import { dd } from '../Lib/Debug';

export interface IGetAllUser {
	count: number;
	rows: pocoUser[];
	limit: number;
	offset: number;
}

/* User Repository Class */
export class UserRepository implements IFullRepository {
	static getInstance(): UserRepository {
		return new UserRepository;
	}

	async Create(params): Promise<pocoUser> {
		const preparedEntity = new Model(params);
		let Entity;
		try {
			Entity = await preparedEntity.save();
		} catch (E) {
			throw { type: 400, msg: `Error: '${E.code}' thrown by the data persistence layer.` };
		}

		return new pocoUser(Entity);
	}

	async Update(params: any): Promise<pocoUser> {
		const {
			id = null,
			name = null,
			lastName = null,
			email = null,
			password = null,
			role = null,
			foreignConstraints = {},
		} = params;
		const Entity = <any>await Model.findById(id).exec();

		if (!Entity) {
			throw { type: 404, msg: `There is no User that matches the id: '${id}'.` };
		}

		Object.getOwnPropertyNames(foreignConstraints).forEach((key) => {
			if (Entity._doc.hasOwnProperty(key) && (`${Entity._doc[key]}` !== `${foreignConstraints[key]}`)) {
				throw { type: 403, msg: `It is forbidden to edit a User that does not belong to you.` };
			}
		});

		if (name) { Entity.name = name; }
		if (lastName) { Entity.lastName = lastName; }
		if (email) { Entity.email = email; }
		if (password) { Entity.password = password; }
		if (role) { Entity.role = role; }

		const updEntity = await Entity.save();
		return new pocoUser(updEntity);
	}

	async Delete(params: any): Promise<pocoUser> {
		const {
			id = null,
			foreignConstraints = {},
		} = params;
		const Entity = <any>await Model.findById(id).exec();

		if (!Entity) {
			throw { type: 404, msg: `There is no User that matches the id: '${id}'.` };
		} else {
			Object.getOwnPropertyNames(foreignConstraints).forEach((key) => {
				if (Entity._doc.hasOwnProperty(key) && (`${Entity._doc[key]}` !== `${foreignConstraints[key]}`)) {
					throw { type: 403, msg: `It is forbidden to delete a User that does not belong to you.` };
				}
			});

			await Model.remove({ _id: id }).exec();

			return new pocoUser(Entity);
		}
	}

	async GetById({ id = null }): Promise<pocoUser> {
		const Entity = await Model.findById(id).exec();

		if (!Entity) {
			throw { type: 404, msg: `There is no User that matches the id: '${id}'.` };
		}

		return new pocoUser(Entity);
	}

	async FindOne(params, fields = null): Promise<pocoUser> {
		const Entity = await Model.findOne(params, fields).exec();

		if (!Entity) {
			throw { type: 404, msg: `There is no User that matches the parameters: '${JSON.stringify(params)}'.` };
		}

		return new pocoUser(Entity);
	}

	async FindBy(params, fields = null): Promise<pocoUser[]> {
		const data: any[] = await Model.find(params, fields).exec();

		return data.map(row => new pocoUser(row));
	}

	async GetAll({ limit, offset, where = {}, sort = {} }): Promise<IGetAllUser> {
		// Important to return Total count
		// do not forget to include!!!!
		const count = await Model.count(where).exec();
		const data: any[] = await Model
			.find(where)
			.skip(offset)
			.limit(limit)
			.sort(sort)
			.exec();

		const rows = data.map(row => new pocoUser(row));

		return { count, rows, limit, offset };
	}
}

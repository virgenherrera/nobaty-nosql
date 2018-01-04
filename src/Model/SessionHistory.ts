import { BelongsTo, Column, DataType, ForeignKey, Model, Scopes, Table } from 'sequelize-typescript';
import { User } from './User';
const defaultAttributes = ['id', 'login', 'logout', 'user_id', ];
// only for debugging
// import { dd } from "../Lib/Debug";

@Scopes({
	default: { attributes: defaultAttributes },
	full: { attributes: defaultAttributes },
	includeUser: {
		attributes: defaultAttributes,
		include: [() => User]
	},
})
@Table({
	tableName: 'session_histories',
})
export class SessionHistory extends Model<SessionHistory> {

	// integer Type
	@Column({
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		type: DataType.BIGINT,
	})
	id: number;

	@Column({
		allowNull: false,
		type: DataType.DATE,
		defaultValue: DataType.NOW
	})
	login: Date;

	@Column({
		allowNull: true,
		type: DataType.DATE,
		defaultValue: null
	})
	logout: Date;

	@ForeignKey(() => User)
	@Column
	user_id: string;

	@BelongsTo(() => User)
	user: User;
}


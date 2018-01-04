import { AllowNull, Column, CreatedAt, DataType, DefaultScope, HasMany, IsEmail, Length, Model, Scopes, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { SessionHistory } from './SessionHistory';
import { obfuscatePassword } from '../Lib/passwordUtil';
const defaultAttributes = ['id', 'first_name', 'last_name', 'email', 'role'];
const fullAttributes = defaultAttributes.concat(['password', 'createdAt', 'updatedAt']);
// only for debugging
// import { dd } from "../Lib/Debug";

@Scopes({
	default: { attributes: defaultAttributes },
	full: { attributes: fullAttributes },
})
@Table({
	tableName: 'users',
})
export class User extends Model<User> {

	@Column({
		allowNull: false,
		primaryKey: true,
		defaultValue: DataType.UUIDV4,
		type: DataType.UUID,
	})
	id: string;

	@AllowNull(false)
	@Column
	first_name: string;

	@AllowNull(false)
	@Column
	last_name: string;

	@IsEmail
	@AllowNull(false)
	@Unique
	@Column
	email: string;

	@Length({min: 5})
	@AllowNull(false)
	@Column
	get password(): string {
		return this.getDataValue('password');
	}
	set password(value: string) {
		this.setDataValue('password', obfuscatePassword( value ) );
	}

	@Column({
		allowNull: false,
		type: DataType.ENUM('user', 'admin'),
		defaultValue: 'user',
	})
	role: string;

	@CreatedAt
	createdAt: Date;

	@UpdatedAt
	updatedAt: Date;

	@HasMany(() => SessionHistory)
	session_histories: SessionHistory[];
}


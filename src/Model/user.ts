import { Document, Schema, Model, model } from 'mongoose';
import { isEmail } from '../Lib/isEmail';
import { obfuscatePassword } from '../Lib/passwordUtil';
import { roleValidator } from '../Lib/roleValidator';
// only for debugging
// import { dd } from "../Sys/Debug";

export interface IUser {
	name: string;
	last_name: string;
	email: string;
	password: string;
	role: string;
}

interface IUserModel extends IUser, Document {
	// Define Model's Contracts here!
}

export const UserSchema: Schema = new Schema({
	name			: {
		type		: String,
	},
	last_name			: {
		type		: String,
	},
	email			: {
		index		: true,
		lowercase	: true,
		required	: true,
		select		: true,
		trim		: true,
		type		: String,
		unique		: true,
		uppercase	: false,
		validate: {
			validator: isEmail,
			message: '{VALUE} is not a valid email!'
		},
	},
	password			: {
		required	: false,
		select		: false,
		trim		: true,
		type		: String,
		set			: (val) => obfuscatePassword(val),
	},
	role			: {
		index		: false,
		lowercase	: false,
		required	: false,
		select		: true,
		trim		: true,
		type		: String,
		unique		: false,
		uppercase	: false,
		set			: roleValidator,
	},
},
{
	timestamps: true
});

export const UserModel: Model<IUserModel> = model<IUserModel>('User', UserSchema);

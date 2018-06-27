import { Document, Schema, Model, model } from 'mongoose';
// only for debugging
// import { dd } from "../Lib/Debug";

export interface IUser {
	name: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
}

interface IUserModel extends IUser, Document { }

export const UserSchema: Schema = new Schema({
	name: {
		index: false,
		unique: false,
		required: false,
		type: String,
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: 'name_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid name!'
		// },
	},
	lastName: {
		index: false,
		unique: false,
		required: false,
		type: String,
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: 'lastName_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid lastName!'
		// },
	},
	email: {
		index: false,
		unique: false,
		required: false,
		type: String,
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: 'email_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid email!'
		// },
	},
	password: {
		index: false,
		unique: false,
		required: false,
		type: String,
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: 'password_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid password!'
		// },
	},
	role: {
		index: false,
		unique: false,
		required: false,
		type: String,
		trim: true,
		select: true,
		lowercase: false,
		uppercase: false,
		// default: 'role_DefaultValue_example',
		// set: (val) => {/* setter func here! */},
		// get: () => {/* getter func here! */},
		// validate: {
		// 	validator: (val) => {/* Validation func here! */},
		// 	message: '{VALUE} is not a valid role!'
		// },
	},
},
	{
		timestamps: true
	}
);

export const UserModel: Model<IUserModel> = model<IUserModel>('User', UserSchema);

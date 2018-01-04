'use strict';
const { UserModel } = require('../dist/Model/user');
const testAdmin = {
	name: 'Admin Name',
	last_name: 'Admin Last Name',
	email: 'admin@admin.com',
	password: '111111',
	role: 'admin',
};

module.exports = {
	up: () => {
		/**
		* Requiring a compiled model way
		*/
		let preparedEntity = new UserModel(testAdmin);
		return preparedEntity.save();
	},

	down: () => {
		/**
		* Requiring a compiled model way
		*/
		delete UserModel.password;
		return UserModel.remove(testAdmin).exec();
	}
};

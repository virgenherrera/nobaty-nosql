'use strict';
const {
	UserModel
} = require('../dist/Model/user');
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
		return preparedEntity.save().then(data => {
			console.log(data);
			return data

		});
	},

	down: () => {
		/**
		 * Requiring a compiled model way
		 */
		delete testAdmin.password;
		return UserModel.remove(testAdmin).exec();
	}
};

'use strict';
const {
	AccountModel
} = require('../dist/Model/Account');
const testAdmin = {
	email: 'admin@admin.com',
	password: '111111',
	userType: 'user',
};

module.exports = {
	up: () => {
		/**
		 * Requiring a compiled model way
		 */
		let preparedEntity = new AccountModel(testAdmin);
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
		return AccountModel.remove(testAdmin).exec();
	}
};

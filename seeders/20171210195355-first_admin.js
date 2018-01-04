'use strict';
const { mongooseConnection } = require('../dist/Lib/mongooseConnection');
const { UserRepository } = require('../dist/Repository/User');
const testAdmin = {
	name: 'Admin Name',
	last_name: 'Admin Last Name',
	email: 'admin@admin.com',
	password: '111111',
	role: 'admin',
};

module.exports = {
	up: (queryInterface, Sequelize) => {
		/**
		* Requiring a compiled model way
		*/
		return mongooseConnection()
		.then(() => UserRepository.Create(testAdmin) )
		.catch(E => console.log(E));
	},

	down: (queryInterface, Sequelize) => {
		/**
		* queryInterface way
		*/
		delete adminUser.password;
		return queryInterface.bulkDelete('users', adminUser );
	}
};

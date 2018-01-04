'use strict';
const { sequelizeConnection } = require('../dist/Lib/sequelizeConnection');
const { User } = require('../dist/Model/User');
const adminUser = {
	first_name: 'Admin Name',
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
		return sequelizeConnection()
		.then(() => User.create(adminUser) )
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

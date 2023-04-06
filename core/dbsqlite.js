const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tododb', 'user', 'password', {
	dialect: 'sqlite',
	host: './todo.sqlite'
});

module.exports = sequelize;
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('test-db', 'sajeda', 'password', {
   dialect: 'sqlite',
  host: './users.sqlite',
 
});

 const db = {};

 db.Sequelize = Sequelize;
 db.sequelize = sequelize;

db.users = require("./userModel.js")(sequelize, Sequelize);

module.exports = db;
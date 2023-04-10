module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
	 id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    userName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
	password: {
      type: Sequelize.STRING,
    },
	confirmPassword:{
		type: Sequelize.STRING,
	}
  });

  return User;
};
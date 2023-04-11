module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
	 id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      // validate: {
      //   len: [5, 10]
      // }
      
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      }
      
      
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
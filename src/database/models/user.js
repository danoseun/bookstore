export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type:DataTypes.STRING,
            unique: true
          },
        password: DataTypes.TEXT,
      },
    );
    User.associate = (models) => {
      
    };
    return User;
  };
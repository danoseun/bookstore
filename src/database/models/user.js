// export default (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//       username: {
//           type:DataTypes.STRING,
//           unique: true
//         },
//       password: DataTypes.TEXT,
//     },
//   );
//   User.associate = (models) => {
    
//   };
//   return User;
// };



const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User'
  });
  return User;
};
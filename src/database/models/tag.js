// export default (sequelize, DataTypes) => {
//   const Tag = sequelize.define('Tag', {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: {
//         args: true,
//       },
//     }
//   }, {});
//   Tag.associate = (models) => {
//     Tag.belongsToMany(models.Book, {
//       through: 'BookTags',
//       as: 'books',
//       foreignKey: 'tagId'
//     });
//   };
//   return Tag;
// };

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.belongsToMany(models.Book, {
        through: 'BookTags',
        as: 'books',
        foreignKey: 'tagId'
      });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Tag'
  });
  return Tag;
};
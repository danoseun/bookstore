// export default (sequelize, DataTypes) => {
//   const Rating = sequelize.define('Rating', {
//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     authorId: {
//       allowNull: false,
//       type: DataTypes.INTEGER
//     },
//     bookSlug: {
//       allowNull: false,
//       type: DataTypes.STRING
//     },
//     rating: {
//       allowNull: false,
//       type: DataTypes.STRING
//     }
//   });
//   Rating.associate = (models) => {
//     Rating.belongsTo(models.Book, { foreignKey: 'bookSlug', as: 'book' });
//   };
//   return Rating;
// };




const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.Book, { foreignKey: 'bookSlug', as: 'book' });
    }
  }
  Rating.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    bookSlug: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rating: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Rating'
  });
  return Rating;
};
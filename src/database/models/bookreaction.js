// export default (sequelize, DataTypes) => {
//   const BookReaction = sequelize.define('BookReaction', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER
//       },
//       isLiked: {
//           type: DataTypes.BOOLEAN,
//           allowNull: false
//       },
//       likedBy: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//           required: true
//       },
//       bookId: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//           required: true
//         }
//     },
//   );
//   BookReaction.associate = (models) => {
//     BookReaction.belongsTo(models.Book, {
//       foreignKey: 'bookId'
//     });
//   };
//   return BookReaction;
// };


const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookReaction.belongsTo(models.Book, {
        foreignKey: 'bookId'
      });
    }
  }
  BookReaction.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    isLiked: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    likedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true
      },
  }, {
    sequelize,
    modelName: 'BookReaction',
  });
  return BookReaction;
};
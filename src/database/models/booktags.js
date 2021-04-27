// export default (sequelize, DataTypes) => {
//   const BookTags = sequelize.define('BookTags', {
//     tagId: DataTypes.INTEGER,
//     bookId: DataTypes.INTEGER
//   }, {});
//   BookTags.associate = () => {
//   };
//   return BookTags;
// };


const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  BookTags.init({
    tagId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookTags',
  });
  return BookTags;
};
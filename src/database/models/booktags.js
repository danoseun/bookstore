export default (sequelize, DataTypes) => {
    const BookTags = sequelize.define('BookTags', {
      tagId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER
    }, {});
    BookTags.associate = () => {
    };
    return BookTags;
  };
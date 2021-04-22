export default (sequelize, DataTypes) => {
    const BookReaction = sequelize.define('BookReaction', {
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
          }
      },
    );
    BookReaction.associate = (models) => {
      BookReaction.belongsTo(models.Book, {
        foreignKey: 'bookId'
      });
    };
    return BookReaction;
  };
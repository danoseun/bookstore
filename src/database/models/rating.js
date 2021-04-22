export default (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
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
      }
    });
    Rating.associate = (models) => {
      Rating.belongsTo(models.Book, { foreignKey: 'bookSlug', as: 'book' });
    };
    return Rating;
  };
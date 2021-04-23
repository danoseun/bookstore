export default (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        slug: {
          allowNull: false,
          type: DataTypes.STRING
        },
        author: {
          allowNull: false,
          type: DataTypes.STRING
        },
        title: {
          allowNull: false,
          unique: false,
          type: DataTypes.STRING
        },
        description: {
          allowNull: false,
          type: DataTypes.STRING
        },
        body: {
          allowNull: false,
          unique: false,
          type: DataTypes.TEXT
        },
        imgUrl: {
          allowNull: true,
          unique: false,
          type: DataTypes.TEXT
        },
        authored_year: {
          allowNull: false,
          type: DataTypes.STRING
        },
        publisher: {
          type: DataTypes.STRING
        },
        release_date: {
          type: DataTypes.STRING
        },
        quantity_available: {
          type: DataTypes.INTEGER
        },
        amount: {
          type: DataTypes.DECIMAL(20, 4).UNSIGNED,
          allowNull: false,
        },
        featured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
    );
    Book.associate = (models) => {
      Book.hasMany(models.BookReaction, {
        foreignKey: 'bookId',
        as: 'bookReactions'
      });
      Book.hasMany(models.Rating, { foreignKey: 'bookSlug', as: 'ratings' });
  
      Book.belongsToMany(models.Tag, {
        through: 'BookTags',
        as: 'tags',
        foreignKey: 'bookId'
      });
    };
    return Book;
  };
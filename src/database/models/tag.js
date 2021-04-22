export default (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
        },
      }
    }, {});
    Tag.associate = (models) => {
      Tag.belongsToMany(models.Book, {
        through: 'BookTags',
        as: 'books',
        foreignKey: 'tagId'
      });
    };
    return Tag;
  };
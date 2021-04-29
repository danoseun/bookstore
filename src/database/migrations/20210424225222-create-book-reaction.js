export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('BookReactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    isLiked: {
      type: Sequelize.BOOLEAN,
      allowNull: false
  },
    likedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      required: true
  },
    bookSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      required: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('BookReactions')
};
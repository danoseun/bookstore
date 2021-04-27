export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Books', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
    },
    title: {
      allowNull: false,
      unique: false,
      type: Sequelize.STRING
    },
    description: {
      allowNull: false,
      type: Sequelize.STRING
    },
    body: {
      allowNull: false,
      unique: false,
      type: Sequelize.TEXT
    },
    imgUrl: {
      allowNull: true,
      unique: false,
      type: Sequelize.TEXT
    },
    authored_year: {
      allowNull: false,
      type: Sequelize.STRING
    },
    publisher: {
      type: Sequelize.STRING
    },
    release_date: {
      type: Sequelize.STRING
    },
    quantity_available: {
      type: Sequelize.INTEGER
    },
    amount: {
      type: Sequelize.DECIMAL(20, 4).UNSIGNED,
      allowNull: false,
    },
    featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
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
  down: queryInterface => queryInterface.dropTable('Books')
};
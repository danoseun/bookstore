import 'dotenv/config';
import { hashPassword } from '../../helpers/password';

const hash = hashPassword(process.env.PASSWORD);


module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'usernameone',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'usernametwo',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'usernamethree',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'usernamefour',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
  
      {},
    ),
    
    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
  };
  
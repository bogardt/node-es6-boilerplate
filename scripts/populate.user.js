import Mongoose, { connectToMongo, disconnectFromMongo } from '../modules/mongo';

const bcryptjs = require('bcryptjs');

require('../models/users');

const users = [
  {
    email: 'admin@test.org',
    username: 'admin_test',
    password: bcryptjs.hashSync('qwerty1234', bcryptjs.genSaltSync(10)),
    role: 'admin'
  },
  {
    email: 'user@test.org',
    username: 'user_test',
    password: bcryptjs.hashSync('qwerty1234', bcryptjs.genSaltSync(10)),
    role: 'user'
  }
];

connectToMongo();

const Users = Mongoose.model('User');
Users.collection.drop(() => {
  users.forEach((user, index) => {
    const person = Users(user);
    person.save(saveErr => {
      if (saveErr) {
        throw saveErr;
      }
      console.log(`User ${user.email} created !`);
      if (index === (users.length - 1)) {
        disconnectFromMongo();
      }
    });
  });
});

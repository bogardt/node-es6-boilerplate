import Mongoose, { connectToMongo, disconnectFromMongo } from '../modules/mongo';

const bcrypt = require('bcrypt');

require('../models/users');

Mongoose.Promise = global.Promise;

const users = [
  {
    email: 'admin@test.org',
    username: 'admin_test',
    password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
    role: 'admin'
  },
  {
    email: 'user@test.org',
    username: 'user_test',
    password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
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

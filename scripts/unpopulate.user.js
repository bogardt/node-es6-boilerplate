import Mongoose, { connectToMongo, disconnectFromMongo } from '../modules/mongo';

require('../models/users');

connectToMongo();

const Users = Mongoose.model('User');
Users.collection.drop(() => {
  disconnectFromMongo();
});

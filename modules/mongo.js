import Mongoose from 'mongoose';
import logger from 'winston';
import config from '../config.dev';

Mongoose.Promise = global.Promise;

export const connectToMongo = async () => {
  try {
    await Mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true
      });
    logger.info('MongoDB connect [OK]');
  } catch (err) {
    logger.error('MongoDB connect [NOK]');
  }
};

export const disconnectFromMongo = async () => {
  try {
    await Mongoose.disconnect();
    logger.info('MongoDB disconnect [OK]');
  } catch (err) {
    logger.error('MongoDB disconnect [NOK]');
  }
};

export default Mongoose;

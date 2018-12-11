import Mongoose from 'mongoose';
import logger from 'winston';
import config from '../config.dev';

Mongoose.Promise = global.Promise;

const connectToMongo = async () => {
  try {
    await Mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, { useNewUrlParser: true });
    logger.info('MongoDB connect [OK]');
  } catch (err) {
    logger.error('MongoDB connect [NOK]');
  }
};

export default connectToMongo;

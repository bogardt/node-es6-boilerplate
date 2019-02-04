import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import config from '../config.dev';
import logger from './logger';
import auth from '../routes/auth';
import user from '../routes/user';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../api/swagger.json');

const port = config.serverPort;

logger.stream = {
  write(message) {
    logger.info(message);
  }
};

export default app => {
  /**
   * Configuration of middlewares
   */
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev', { stream: logger.stream }));
  app.use(express.static(__dirname));
  app.use(passport.initialize());
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  /**
   * Declaring api entities here
   */
  app.use('/api/auth', auth);
  app.use('/api/user', user);

  /**
   * For others
   */
  app.get('/', (req, res) => {
    res.send('Invalid endpoint!');
  });

  // Start the server
  app.listen(port, () => {
    logger.info('server started - ', port);
  });
};

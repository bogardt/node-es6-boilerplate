import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import swaggerTools from 'swagger-tools';
import config from './config.dev';
import logger from './modules/winston';
import connectToMongo from './modules/mongo';
import users from './routes/users';

require('./modules/passport');

const port = config.serverPort;

logger.stream = {
  write(message) {
    logger.info(message);
  }
};

connectToMongo();

const app = express();

/**
 * swaggerRouter configuration
 */
const options = {
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'dev' // Conditionally turn on stubs (mock mode)
};

/**
 *  The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
 */
const swaggerDoc = require('./api/swagger.json');

/**
 *  Initialize the Swagger middleware
 */
swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  /**
   *  Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
   */
  app.use(middleware.swaggerMetadata());

  /**
   *  Validate Swagger requests
   */
  app.use(middleware.swaggerValidator());

  /**
   *  Route validated requests to appropriate controller
   */
  app.use(middleware.swaggerRouter(options));

  /**
   *  Serve the Swagger documents and Swagger UI
   */
  app.use(middleware.swaggerUi());

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('dev', { stream: logger.stream }));
  app.use(express.static(__dirname));
  app.use(passport.initialize());

  app.use('/api/users', users);

  app.get('/', (req, res) => {
    res.send('Invalid endpoint!');
  });

  // Start the server
  app.listen(port, () => {
    logger.info('server started - ', port);
  });
});
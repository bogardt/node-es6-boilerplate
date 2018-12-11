import express from 'express';
import config from './config.dev';
import connectToMongo from './modules/mongo';
import expressConfig from './modules/express';

require('./modules/passport');

class Server {
  constructor() {
    this.app = express();
    this.config = config;
    this.init();
  }

  init() {
    /**
     * Mongodb config
     */
    connectToMongo();

    /**
     * Express config
     */
    expressConfig(this.app);
  }
}

export default new Server().app;

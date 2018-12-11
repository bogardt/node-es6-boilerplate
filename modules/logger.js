import * as winston from 'winston';
import * as rotate from 'winston-daily-rotate-file'; // eslint-disable-line
import * as fs from 'fs';
import config from '../config.dev';

const dir = config.logFileDir;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const logger = new winston.Logger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      colorize: true
    }),
    new winston.transports.DailyRotateFile({
      filename: config.logFileName,
      dirname: config.logFileDir,
      maxsize: 20971520, // 20MB
      maxFiles: 25,
      datePattern: '.dd-MM-yyyy'
    })
  ]
});

export default logger;

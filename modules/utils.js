/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import bcrypt from 'bcrypt';

const jwtStrategry = require('./passport');

passport.use(jwtStrategry);

export const PassportAuthUser = async (req, res) => new Promise(resolve => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    return resolve(user);
  })(req, res);
});

export const ComparePassword = async (userPassword, reqPassword) => new Promise((resolve, reject) => {
  bcrypt.compare(reqPassword, userPassword, (err, success) => {
    if (err) {
      return reject(err);
    }
    return resolve(success);
  });
});

export const DeleteJoiUselessData = errors => {
  delete errors._object;
  delete errors.isJoi;
  return errors;
};

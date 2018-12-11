import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/users';
import logger from '../modules/logger';
import config from '../config.dev';
import { PassportAuthUser, ComparePassword, DeleteJoiUselessData } from '../modules/utils';

const bcrypt = require('bcrypt');

const controller = {};

/**
 * Route('/api/users/register')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.register = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-zA-Z]).{6,30}$/)
        .required(), // password alpha + digit between 6 to 30 chars
      role: Joi.string()
        .valid('user', 'admin')
        .required()
    });

    const result = Joi.validate(req.body, schema, { abortEarly: false });
    if (result.error !== null) {
      return res
        .status(400)
        .send({ message: 'Bad request', errorInfo: DeleteJoiUselessData(result.error) });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const newUser = new User();
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    newUser.role = 'user';
    await newUser.save();

    return res.status(201).send({ message: 'User successfully created' });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/users/login')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: 'Wrong username or wrong password' });
    }
    const check = await ComparePassword(user.password, req.body.password);
    if (check) {
      const token = jwt.sign({ email: user.email }, config.secretJWT);
      return res.status(200).send({ bearer: token });
    }
    return res.status(404).send({ message: 'Wrong username or wrong password' });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/users/me')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.me = async (req, res) => {
  try {
    const user = await PassportAuthUser(req, res);
    return res.status(200).send({
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role
    });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/users?email={userEmail}')
 * DELETE
 * @param {*} req
 * @param {*} res
 */
controller.deleteUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.status(404).send({ message: 'User doesn\'t exist' });
    }
    user = await User.deleteOne({ email: req.query.email });
    return res.status(200).send({ message: 'User has been deleted' });
  } catch (err) {
    logger.error(`Error in register user- ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

export default controller;

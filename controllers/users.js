import jwt from 'jsonwebtoken';
import User from '../models/users';
import logger from '../modules/winston';
import config from '../config.dev';
import { PassportAuthUser, ComparePassword } from '../modules/utils';

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
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const newUser = new User();
    newUser.username = req.body.username;
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.role = req.body.role;
    newUser.rooms = [];
    newUser.friends = [];
    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
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

export default controller;

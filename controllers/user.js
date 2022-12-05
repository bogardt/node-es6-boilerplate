import Joi from 'joi';
import User from '../models/users';
import logger from '../modules/logger';
import { PassportAuthUser, DeleteJoiUselessData } from '../modules/utils';

const bcryptjs = require('bcryptjs');

const filterMongoUser = user => ({
  id: user.id,
  role: user.role,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt
});

const controller = {};

/**
 * Route('/api/user?email={userEmail}')
 * GET
 * @param {*} req
 * @param {*} res
 */
controller.getUser = async (req, res) => {
  try {
    const userReq = await PassportAuthUser(req, res);
    if (userReq.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' });
    }

    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .lowercase()
        .required()
    });

    const result = Joi.validate(req.query, schema, { abortEarly: false });
    if (result.error !== null) {
      return res
        .status(400)
        .send({ message: 'Bad request', errorInfo: DeleteJoiUselessData(result.error) });
    }
    
    const user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.status(404).send({ message: 'User doesn\'t exist' });
    }

    return res.status(200).send(filterMongoUser(user));
  } catch (err) {
    logger.error(`Error in GET /api/user - ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/user')
 * POST
 * @param {*} req
 * @param {*} res
 */
controller.createUser = async (req, res) => {
  try {
    const userReq = await PassportAuthUser(req, res);
    if (userReq.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' });
    }

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
    newUser.password = bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10));
    newUser.role = req.body.role;

    await newUser.save();

    return res.status(201).send({ message: 'User successfully created' });
  } catch (err) {
    logger.error(`Error in POST /api/user - ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/user')
 * PUT
 */
controller.modifyUser = async (req, res) => {
  try {
    const userReq = await PassportAuthUser(req, res);
    if (userReq.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' });
    }

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
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.email = req.body.email;
    user.username = req.body.username;
    user.password = bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10));
    user.role = req.body.role;

    await user.save();

    return res.sendStatus(204);
  } catch (err) {
    logger.error(`Error in PUT /api/user - ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/user')
 * PATCH
 */
controller.updateUser = async (req, res) => {
  try {
    const userReq = await PassportAuthUser(req, res);
    if (userReq.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' });
    }

    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .lowercase()
        .required(), // needed to find which user update
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-zA-Z]).{6,30}$/),
      role: Joi.string()
        .valid('user', 'admin')
    });

    const result = Joi.validate(req.body, schema, { abortEarly: false });
    if (result.error !== null) {
      return res
        .status(400)
        .send({ message: 'Bad request', errorInfo: DeleteJoiUselessData(result.error) });
    }

    const {
      email,
      username,
      password,
      role
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.role = role || user.role;
    user.password = password !== undefined ? bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)) : user.password;

    await user.save();

    return res.sendStatus(204);
  } catch (err) {
    logger.error(`Error in PATCH /api/user - ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

/**
 * Route('/api/user?email={userEmail}')
 * DELETE
 * @param {*} req
 * @param {*} res
 */
controller.deleteUser = async (req, res) => {
  try {
    const userReq = await PassportAuthUser(req, res);
    if (userReq.role !== 'admin') {
      return res.status(403).send({ message: 'Forbidden' });
    }
    
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .lowercase()
        .required()
    });

    const result = Joi.validate(req.query, schema, { abortEarly: false });
    if (result.error !== null) {
      return res
        .status(400)
        .send({ message: 'Bad request', errorInfo: DeleteJoiUselessData(result.error) });
    }
    
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User doesn\'t exist' });
    }

    await User.deleteOne({ email });

    return res.status(200).send({ message: 'User has been deleted' });
  } catch (err) {
    logger.error(`Error in DELETE /api/user - ${err}`);
    return res.status(500).send({ message: 'Internal error server', errorInfo: err });
  }
};

export default controller;

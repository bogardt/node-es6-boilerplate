import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/me').get(userController.me);
router.route('/').delete(userController.deleteUser);

export default router;

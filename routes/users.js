import express from 'express';
import userController from '../controllers/users';

const router = express.Router();

router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/me').get(userController.me);
router.route('/change_password').patch(userController.changePassword);
router.route('/').delete(userController.deleteUser);

export default router;

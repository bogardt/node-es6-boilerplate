import express from 'express';
import authController from '../controllers/auth';

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/me').get(authController.me);
router.route('/change_password').patch(authController.changePassword);

export default router;

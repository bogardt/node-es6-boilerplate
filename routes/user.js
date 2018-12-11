import express from 'express';
import userController from '../controllers/user';

const router = express.Router();

router.route('/')
  .get(userController.getUser)
  .post(userController.createUser)
  .put(userController.modifyUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;

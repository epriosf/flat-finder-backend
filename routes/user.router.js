import express from 'express';
import {
  deleteUser,
  getUserById,
  getUsers,
  saveUser,
  updateUser,
} from '../controllers/user.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
import { verifyOwnerAccount } from '../middlewares/verifyOwnerAccount.middleware.js';
const router = express.Router();

router.post('/', saveUser);
router.get('/', authorizationMiddleware(['admin']), getUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  authorizationMiddleware(['admin', 'user']),
  verifyOwnerAccount,
  updateUser
);
router.delete('/:id', authorizationMiddleware(['admin']), deleteUser);

export default router;

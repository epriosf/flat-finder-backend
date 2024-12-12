import express from 'express';
import {
  deleteUser,
  getUserById,
  getUsers,
  saveUser,
  updateUser,
} from '../controllers/user.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
const router = express.Router();

router.post('/', saveUser);
router.get('/', authorizationMiddleware(['admin']), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorizationMiddleware(['admin']), updateUser);
router.delete('/:id', authorizationMiddleware(['admin']), deleteUser);

export default router;

// * /users GET
// * /users/:id GET -> /:id GET
// * /users/:id PATCH -> /Patch
// * /users/:id DELETE -> /DELETE
import express from 'express';
import {
  deleteUser,
  getUsers,
  saveUser,
} from '../controllers/user.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
const router = express.Router();

router.post('/', saveUser);
router.get('/', authorizationMiddleware(['admin']), getUsers);
router.delete('/:id', deleteUser);

export default router;

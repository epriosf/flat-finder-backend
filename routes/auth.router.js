//* login /users/login POST
// * register /register POST
import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPassword,
} from '../controllers/auth.controller.js';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';

const router = express.Router();

router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/me', authenticateUser, me);
router.post('/users/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;

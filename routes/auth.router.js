//* login /users/login POST
// * register /register POST
import express from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/users/register', register);
router.post('/users/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;

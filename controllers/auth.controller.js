import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import sendEmail from '../utils/email.js';
import logger from '../utils/logger.js';
import { loginSchema, registerSchema } from './../validators/user.validator.js';
const register = async (req, res) => {
  try {
    const validatedBody = await registerSchema.validateAsync(req.body);

    const user = new User(validatedBody);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error during user registration', { error: error.message });
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      logger.warning('Validation error during login', {
        error: error.details[0].message,
      });
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePasswords(password))) {
      logger.warning('Login failed: Invalid credentials', { email });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = await jwt.sign(
      { user_id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
      .status(200)
      .json({ message: 'Login successful' });
  } catch (error) {
    logger.error('Error during login', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
const me = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie('token').status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: `Error logging out ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //1. Vamos a validar si el correo que esta enviando existe o esta alamacenado en la BDD
    const user = await User.findOne({ email });
    if (!user) {
      logger.warning('Forgot password failed: User not found', { email });
      return res.status(404).json({ message: 'User not found' });
    }

    //2.- Vamos a generar un token unico que vamos a enviar al correo del usuario
    const resetToken = user.generatePasswordToken();
    await user.save({ validateBeforeSave: false });

    //3.- Vamos a generar la url que vamos a enviar al correo del usuario
    //http://localhost:5173/reset-password/jkashdfjkasdfhk&hjaf
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      const message = `Para resetear el password, accede al siguiente link: ${resetUrl}`;
      await sendEmail({
        email: user.email,
        subject: 'Reset Password',
        message,
      });
      res.json({ message: 'Email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    logger.error('Error sending password reset email', {
      error: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    //1.- Vamos a obtener el token del request
    const { token } = req.params;
    //2.- Vamos a obtener la nueva password que ha configurado el usuario
    const { password } = req.body;
    //3.- En BDD tenemos el token pero esta hasheado y lo que llega en el request esta en texto plano
    //Vamos a hashear el token que llega en el request para poder compararlo con el token hasheado que tenemos en la BDD
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    //4.- Vamos a buscar ese usuario de acuerdo al token hasheado, y ademas vamos a aplicar la condicion de tiempo de vida del token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    //5.- Validar si el usuario que estamos buscando existe o no
    if (!user) {
      logger.warning('Reset password failed: Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    //6.- Vamos a actualizar la password del usuario
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    logger.error('Error during password reset', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

export { forgotPassword, login, logout, me, register, resetPassword };

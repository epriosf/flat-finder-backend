// Impementar la funcion getAllUsers
// Implementar la funcion getUserById
// Implementar la funcion updateUser
// Implementar la funcion deleteUser
// Buenas practicas a tomar en cuenta:
// - Siempre usar try-catch para manejo de erroress
// - cuando haya un error retornar codigo 500 (INTERNAL SERVER ERROR)
//- Siempre retornar el codigo de estado correspondiente
// 200 ->OK
// 201 -> CREATED ()
// 404 -> NOT FOUND (Cuando no se encuentra un recurso)
// Si se animna usar loggers, siempre registrar un evento de error cada vez que ingresen al catch
import mongoose from 'mongoose';
import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  saveUserService,
  updateUserService,
} from '../services/user.service.js';
import logger from '../utils/logger.js';
import { registerSchema } from '../validators/user.validator.js';

const saveUser = async (req, res, next) => {
  try {
    //validate schema
    const { error } = registerSchema.validate(req.body);
    if (error) {
      logger.warning(`Validation error for saveUser: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }
    //service
    const newUser = await saveUserService(req.body);
    logger.info(`User created successfully with ID: ${newUser._id}`);
    res
      .status(201)
      .json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    logger.error(`Error saving flat: ${error.message}`);
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userData = req.body;
    const { updatedUser, message } = await updateUserService(id, userData);

    if (!updatedUser) {
      logger.warning(`User not found for update with ID: ${id}`);
      return res.status(404).json({ message });
    }

    res.status(200).json({ message, data: updatedUser });
  } catch (error) {
    logger.error(`Error updating user with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await getUserByIdService(id);

    if (!user) {
      logger.warning(`User not found with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user with ID:${id}, Error: ${error.message}`);
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const query = req.query;
    const { users, pagination } = await getUsersService(query);

    res.status(200).json({
      data: users,
      pagination,
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    const deletedUser = await deleteUserService(id);

    if (!deletedUser) {
      logger.warning(`User not found or already deleted with ID: ${id}`);
      return res
        .status(404)
        .json({ message: 'User not found or already deleted' });
    }
    logger.info(`User deleted successfully with ID: ${id}`);

    res
      .status(200)
      .json({ message: 'User deleted successfully', data: deletedUser });
  } catch (error) {
    logger.error(`Error deleting user with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};

export { deleteUser, getUserById, getUsers, saveUser, updateUser };

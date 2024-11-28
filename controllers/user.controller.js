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
import { User } from "../models/user.model.js";

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { saveUser, getUsers, deleteUser };

import mongoose from 'mongoose';

//definir el schema de la base de datos para la coleccion de usuarios
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  favouriteFlats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
    },
  ],
  deleted: {
    type: Date,
  },
  //El proyecto pide un borrado fisico, pero mejor es hacer un borrado logico
});
export const User = mongoose.model('User', userSchema);

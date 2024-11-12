import mongoose from 'mongoose'

//definir el schema de la base de datos para la coleccion de usuarios
const flatSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true
  },
  streetName: {
    type: String,
    required: true
  },
  streetNumber: {
    type: String,
    required: true
  },
  areaSize: {
    type: Number,
    required: true
  },
  hasAc: {
    type: Number,
    required: true
  },
  yearBuilt: {
    type: Number
  },
  rentPrice: {
    type: Number,
    required: true
  },
  dateAvailable: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },

  deleted: {
    type: Date
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  //El proyecto pide un borrado fisico, pero mejor es hacer un borrado logico
})
export const User = mongoose.model('User', flatSchema)

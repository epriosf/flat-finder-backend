import mongoose from 'mongoose'

//definir el schema de la base de datos para la coleccion de usuarios
const flatSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'city is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    streetName: {
      type: String,
      required: [true, 'streetName is required'],
      trim: true,
      minlength: [3, 'Street name must have at least 3 characters.']
    },
    streetNumber: {
      type: String,
      required: [true, 'streetNumber is required'],
      trim: true,
      match: [
        /^\d+[A-Za-z]?$/,
        'Street number must be a valid number or alphanumeric (e.g., 123A).'
      ]
    },
    areaSize: {
      type: Number,
      required: [true, 'areaSize is required'],
      trim: true,
      min: [10, 'Area size must be at least 10 square meters.']
    },
    hasAc: {
      type: Boolean,
      required: [true, 'hasAc is required']
    },
    yearBuilt: {
      type: Number,
      required: [true, 'yearBuilt is required']
    },
    rentPrice: {
      type: Number,
      required: [true, 'rentPrice is required'],
      trim: true,
      min: [0, 'Rent price must be a positive number.']
    },
    dateAvailable: {
      type: Date
    },
    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User'
    // },

    deleted: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)
// Middleware for updated field
flatSchema.pre('save', async function (next) {
  this.updated = new Date()
  next()
})
export const Flat = mongoose.model('Flat', flatSchema)

import mongoose from 'mongoose';

const flatSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'city is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    streetName: {
      type: String,
      required: [true, 'streetName is required'],
      trim: true,
      minlength: [3, 'Street name must have at least 3 characters.'],
    },
    streetNumber: {
      type: String,
      required: [true, 'streetNumber is required'],
      trim: true,
      match: [
        /^\d+[A-Za-z]?$/,
        'Street number must be a valid number or alphanumeric (e.g., 123A).',
      ],
    },
    areaSize: {
      type: Number,
      required: [true, 'areaSize is required'],
      min: [10, 'Area size must be at least 10 square meters.'],
    },
    hasAc: {
      type: Boolean,
      required: [true, 'hasAc is required'],
      default: false,
    },
    yearBuilt: {
      type: Number,
      required: [true, 'yearBuilt is required'],
      min: [1980, 'Year built must be after 1980.'],
      max: [new Date().getFullYear(), 'Year built cannot be in the future.'],
    },
    rentPrice: {
      type: Number,
      required: [true, 'rentPrice is required'],
      min: [0, 'Rent price must be a positive number.'],
    },
    dateAvailable: {
      type: [Date],
      validate: {
        validator: function (value) {
          return (
            value.length === 2 &&
            value[0] instanceof Date &&
            value[1] instanceof Date &&
            value[0] < value[1]
          );
        },
        message:
          'dateAvailable must contain exactly two dates and the initial date must be earlier than the final date',
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    deleted: {
      type: Date,
      default: null,
    },
    rooms: {
      type: Number,
      required: [true, 'Rooms are required'],
      min: [1, 'There must be at least one room'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Bathrooms are required'],
      min: [1, 'There must be at least one bathroom'],
    },
  },
  { timestamps: true }
);
flatSchema.statics.findActive = function () {
  return this.find({ deleted: null })
    .select(
      '_id city streetName streetNumber areaSize hasAc yearBuilt rentPrice dateAvailable ownerId rooms bathrooms'
    )
    .populate('ownerId', 'email');
};
flatSchema.methods.isDeleted = function () {
  return this.deleted !== null;
};
export const Flat = mongoose.model('Flat', flatSchema);

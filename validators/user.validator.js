import Joi from 'joi';
import mongoose from 'mongoose';
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .pattern(/.+@.+\..+/)
    .messages({
      'string.email': 'Please provide a valid email address.',
      'string.pattern.base': 'Please provide a valid email address.',
    }),
  password: Joi.string().min(4).required().messages({
    'string.min': 'Password must be at least 4 characters long.',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required.',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required.',
  }),
  birthDate: Joi.date().optional().messages({
    'date.base': 'Birth date must be a valid date.',
  }),
  isAdmin: Joi.boolean().optional(),
  role: Joi.string().valid('admin', 'user').optional().default('user'),
  favouriteFlats: Joi.array()
    .items(
      Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid', { value });
          }
          return value;
        })
        .messages({
          'any.invalid': 'Each favouriteFlat must be a valid ObjectId.',
        })
    )
    .optional()
    .messages({
      'array.base': 'Favourite flats must be an array.',
    }),
});
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { loginSchema, registerSchema };

import Joi from 'joi';

const flatSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  city: Joi.string().trim().optional(),
  minRentPrice: Joi.number().integer().min(0).optional(),
  maxRentPrice: Joi.number()
    .integer()
    .min(0)
    .when('minRentPrice', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('minRentPrice')),
    })
    .optional(),
  hasAc: Joi.boolean().optional(),
  sort: Joi.string()
    .valid('city', 'rentPrice', 'areaSize', 'yearBuilt')
    .default('city'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
});

const flatSaveSchema = Joi.object({
  city: Joi.string().trim().lowercase().required().messages({
    'string.empty': 'City is required',
  }),
  streetName: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Street name is required',
    'string.min': 'Street name must be at least 3 characters',
  }),
  streetNumber: Joi.string()
    .trim()
    .pattern(/^\d+[A-Za-z]?$/)
    .required()
    .messages({
      'string.empty': 'Street number is required',
      'string.pattern.base': 'Street number must follow the correct format',
    }),
  areaSize: Joi.number().min(10).required().messages({
    'number.base': 'Area size must be a number',
    'number.min': 'Area size must be at least 10',
  }),
  hasAc: Joi.boolean().required().messages({
    'boolean.base': 'Has AC must be a boolean',
    'any.required': 'Has AC is required',
  }),
  yearBuilt: Joi.number().integer().required().messages({
    'number.base': 'Year built must be a number',
    'any.required': 'Year built is required',
  }),
  rentPrice: Joi.number().min(0).required().messages({
    'number.base': 'Rent price must be a positive number',
    'number.min': 'Rent price must be at least 0',
  }),
  dateAvailable: Joi.array()
    .length(2)
    .items(Joi.date())
    .custom(([start, end], helpers) => {
      if (new Date(start) >= new Date(end)) {
        return helpers.message('Start date must be before end date');
      }
      return [start, end];
    })
    .required(),
  ownerId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .trim()
    .required()
    .messages({
      'string.pattern.base': 'Owner ID must be a valid ObjectId',
    }), // Valid ObjectId
}).unknown(false);

export { flatSaveSchema, flatSchema };

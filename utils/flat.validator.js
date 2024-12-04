import Joi from 'joi';
const flatSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  city: Joi.string().trim().optional(),
  minRentPrice: Joi.number().integer().min(0).optional(),
  maxRentPrice: Joi.number().integer().min(0).optional(),
  hasAc: Joi.boolean().optional(),
  sort: Joi.string()
    .valid('city', 'rentPrice', 'areaSize', 'yearBuilt')
    .default('city'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
});

export { flatSchema };

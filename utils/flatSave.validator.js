import Joi from 'joi';
const flatSaveSchema = Joi.object({
  city: Joi.string().required(),
  streetName: Joi.string().min(3).required(),
  streetNumber: Joi.string().required(),
  areaSize: Joi.number().min(10).required(),
  hasAc: Joi.boolean().required(),
  yearBuilt: Joi.number().required(),
  rentPrice: Joi.number().min(0).required(),
  dateAvailable: Joi.array().length(2).items(Joi.date()).required(),
  ownerId: Joi.string().required(),
  deleted: Joi.date().allow(null),
});
export { flatSaveSchema };

import { Flat } from '../models/flat.model.js';
import { buildFilters } from '../utils/filterBuilder.js';

export const saveFlatService = async (flatData) => {
  const flat = new Flat(flatData);
  await flat.save();
  return flat;
};

export const getFlatByIdService = async (id) => {
  const flat = await Flat.findActive().findOne({ _id: id });
  return flat;
};
export const updateFlatService = async (id, flatData) => {
  const flat = await Flat.findActive().findOne({ _id: id });
  if (!flat) {
    return { updatedFlat: null, message: 'Flat not found' };
  }
  const isModified = Object.entries(flatData).some(
    ([key, value]) => flat[key] !== value
  );
  if (!isModified) {
    return { updatedFlat: null, message: 'There is nothing to update' };
  }

  Object.assign(flat, flatData);
  const updatedFlat = await flat.save();
  return { updatedFlat, message: 'Flat updated successfully' };
};

export const deleteFlatService = async (id) => {
  const flat = await Flat.findActive().findOne({ _id: id });
  if (!flat) {
    return null;
  }
  flat.deleted = new Date();

  await flat.save();

  return flat;
};
export const getFlatsService = async (query) => {
  // Filters
  const filters = { ...buildFilters(query), deleted: { $eq: null } };
  //Sorting
  const sort = { [query.sort]: query.order === 'desc' ? -1 : 1 };

  const skip = (query.page - 1) * query.limit;

  const flats = await Flat.find(filters)
    .populate('ownerId')
    .sort(sort)
    .skip(skip)
    .limit(query.limit);
  const totalFlats = await Flat.countDocuments(filters);
  //pagination
  const pagination = {
    total: totalFlats,
    limit: query.limit,
    page: query.page,
    totalPages: Math.ceil(totalFlats / query.limit),
    hasNextPage: query.page * query.limit < totalFlats,
    hasPreviousPage: query.page > 1,
  };
  return { flats, pagination };
};

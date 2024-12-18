import { Flat } from '../models/flat.model.js';
import { buildFlatFilters } from '../utils/filterBuilder.js';

export const saveFlatService = async (flatData) => {
  const flat = new Flat(flatData);
  await flat.save();

  // Re-fetch the saved flat with excluded fields
  const savedFlat = await Flat.findById(flat._id);

  return savedFlat;
};

export const getFlatByIdService = async (id) => {
  const flat = await Flat.findActive()
    .select('-deleted -createdAt -updatedAt -__v')
    .findOne({ _id: id })
    .populate('ownerId', 'firstName lastName');
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
  const filters = { ...buildFlatFilters(query), deleted: { $eq: null } };
  //Sorting
  const sort = { [query.sort]: query.order === 'desc' ? -1 : 1 };

  const skip = (query.page - 1) * query.limit;

  const flats = await Flat.find(filters)
    .select('-deleted -createdAt -updatedAt -__v')
    .populate('ownerId', '_id email firstName lastName isAdmin role')
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
export const getFlatsByIdsService = async (flatIds, query) => {
  const filters = {
    _id: { $in: flatIds }, // Match any _id in the array
    deleted: { $eq: null }, // Ensure only active flats
  };

  const sort = query.sort
    ? { [query.sort]: query.order === 'desc' ? -1 : 1 }
    : {};
  const limit = parseInt(query.limit, 10) || 10; // Default limit to 10
  const page = parseInt(query.page, 10) || 1; // Default page to 1
  const skip = (page - 1) * limit;

  // Fetch flats
  const flats = await Flat.find(filters)
    .select('-deleted -createdAt -updatedAt -__v')
    .populate('ownerId', '_id email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalFlats = await Flat.countDocuments(filters);

  return {
    flats,
    pagination: {
      total: totalFlats,
      limit,
      page,
      totalPages: Math.ceil(totalFlats / limit),
      hasNextPage: page * limit < totalFlats,
      hasPreviousPage: page > 1,
    },
  };
};
export const getUserFlatsService = async (userId, query) => {
  const filters = {
    ownerId: userId, // Filter by ownerId
    deleted: { $eq: null }, // Ensure only active flats
    ...buildFlatFilters(query), // Apply additional filters if provided
  };

  const sort = query.sort
    ? { [query.sort]: query.order === 'desc' ? -1 : 1 }
    : {};

  const limit = parseInt(query.limit, 10) || 10; // Default limit to 10
  const page = parseInt(query.page, 10) || 1; // Default page to 1
  const skip = (page - 1) * limit;

  // Fetch flats for the given user
  const flats = await Flat.find(filters)
    .select('-deleted -createdAt -updatedAt -__v')
    .populate('ownerId', '_id email firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalFlats = await Flat.countDocuments(filters);

  return {
    flats,
    pagination: {
      total: totalFlats,
      limit,
      page,
      totalPages: Math.ceil(totalFlats / limit),
      hasNextPage: page * limit < totalFlats,
      hasPreviousPage: page > 1,
    },
  };
};

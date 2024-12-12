import { User } from '../models/user.model.js';
import { buildUserFilters } from '../utils/filterBuilder.js';

export const saveUserService = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const getUserByIdService = async (id) => {
  const user = await User.findActive().findOne({ _id: id });
  return user;
};
export const updateUserService = async (id, userData) => {
  const user = await User.findActive().findOne({ _id: id });
  if (!user) {
    return { updatedFlat: null, message: 'User not found' };
  }
  const isModified = Object.entries(userData).some(
    ([key, value]) => user[key] !== value
  );
  if (!isModified) {
    return { updatedFlat: null, message: 'There is nothing to update' };
  }

  Object.assign(user, userData);
  const updatedUser = await user.save();
  return { updatedUser, message: 'User updated successfully' };
};

export const deleteUserService = async (id) => {
  const user = await User.findActive().findOne({ _id: id });
  if (!user) {
    return null;
  }
  user.deleted = new Date();

  await user.save();

  return user;
};
export const getUsersService = async (query) => {
  // Filters
  const filters = { ...buildUserFilters(query), deleted: { $eq: null } };
  //Sorting
  const sort = { [query.sort]: query.order === 'desc' ? -1 : 1 };

  const skip = (query.page - 1) * query.limit;

  const users = await User.find(filters)
    .populate('favouriteFlats')
    .sort(sort)
    .skip(skip)
    .limit(query.limit);
  const totalFlats = await User.countDocuments(filters);
  //pagination
  const pagination = {
    total: totalFlats,
    limit: query.limit,
    page: query.page,
    totalPages: Math.ceil(totalFlats / query.limit),
    hasNextPage: query.page * query.limit < totalFlats,
    hasPreviousPage: query.page > 1,
  };
  return { users, pagination };
};

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
  // Filters for users
  const filters = { ...buildUserFilters(query), deleted: { $eq: null } };

  // Sorting
  const sort = query.sort
    ? { [query.sort]: query.order === 'desc' ? -1 : 1 }
    : {};

  const limit = parseInt(query.limit, 10) || 10;
  const page = parseInt(query.page, 10) || 1;
  const skip = (page - 1) * limit;

  // Fetch users and count their flats using aggregation
  const users = await User.aggregate([
    { $match: filters },
    {
      $lookup: {
        from: 'flats',
        localField: '_id',
        foreignField: 'ownerId',
        as: 'flats',
      },
    },
    {
      $addFields: {
        flatsCount: { $size: '$flats' },
      },
    },
    {
      $project: {
        flats: 0,
        password: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0, // Exclude updatedAt
        deletedAt: 0, // Exclude deletedAt
      },
    },
    { $sort: sort }, // Apply sorting
    { $skip: skip }, // Apply pagination skip
    { $limit: limit }, // Apply pagination limit
  ]);

  // Total count of users
  const totalUsers = await User.countDocuments(filters);

  // Pagination info
  const pagination = {
    total: totalUsers,
    limit,
    page,
    totalPages: Math.ceil(totalUsers / limit),
    hasNextPage: page * limit < totalUsers,
    hasPreviousPage: page > 1,
  };

  return { users, pagination };
};

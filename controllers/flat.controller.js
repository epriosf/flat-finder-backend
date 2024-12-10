import mongoose from 'mongoose';
import { buildFilters } from '../utils/filterBuilder.js';
import { flatSchema } from '../utils/flat.validator.js';
import { flatSaveSchema } from '../utils/flatSave.validator.js';
import logger from '../utils/logger.js';
import { Flat } from './../models/flat.model.js';
const getFlats = async (req, res, next) => {
  try {
    // Validate query parameters
    const { value: query, error } = flatSchema.validate(req.query);
    if (error) {
      logger.warning(`Invalid query parameters: ${error.message}`);
      return res
        .status(400)
        .json({ message: `Invalid query parameters: ${error.message}` });
    }
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

    res.status(200).json({
      data: flats,
      pagination: {
        total: totalFlats,
        limit: query.limit,
        page: query.page,
        totalPages: Math.ceil(totalFlats / query.limit),
        hasNextPage: query.page * query.limit < totalFlats,
        hasPreviousPage: query.page > 1,
      },
    });
  } catch (error) {
    logger.error(`Error fetching flats: ${error.message}`);
    next(error);
  }
};
const getFlatById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const flat = await Flat.findOne({ _id: id, deleted: { $eq: null } });

    if (!flat) {
      logger.warning(`Flat not found with ID: ${id}`);
      return res.status(404).json({ message: 'Flat not found' });
    }

    res.status(200).json(flat);
  } catch (error) {
    logger.error(`Error fetching flat with ID:${id}, Error: ${error.message}`);
    next(error);
  }
};

const saveFlat = async (req, res, next) => {
  try {
    const { error } = flatSaveSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const newFlat = new Flat(req.body);
    await newFlat.save();
    res
      .status(201)
      .json({ message: 'Flat created successfully', data: newFlat });
  } catch (error) {
    logger.error(`Error saving flat: ${error.message}`);
    next(error);
  }
};

const updateFlat = async (req, res, next) => {
  const { id } = req.params;
  try {
    const flatData = req.body;
    if (flatData.ownerId) {
      logger.warning(`Attempt to update ownerId of flat with ID: ${id}`);
      return res.status(400).json({ message: 'Cannot update ownerId' });
    }

    const updatedFlat = await Flat.findOneAndUpdate(
      { _id: id, deleted: { $eq: null } },
      flatData,
      { new: true }
    );

    if (!updatedFlat) {
      logger.warning(`Flat not found for update with ID: ${id}`);
      return res.status(404).json({ message: 'Flat not found' });
    }

    res
      .status(200)
      .json({ message: 'Flat updated successfully', data: updatedFlat });
  } catch (error) {
    logger.error(`Error updating flat with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};

const deleteFlat = async (req, res, next) => {
  console.log('Request params:', req.params);
  const { id } = req.params;

  // Validate id
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid or missing flat ID' });
  }

  try {
    const deletedFlat = await Flat.findOneAndUpdate(
      { _id: id, deleted: { $eq: null } },
      { deleted: new Date() },
      { new: true }
    );

    if (!deletedFlat) {
      logger.warning(`Flat not found or already deleted with ID: ${id}`);
      return res
        .status(404)
        .json({ message: 'Flat not found or already deleted' });
    }

    res
      .status(200)
      .json({ message: 'Flat deleted successfully', data: deletedFlat });
  } catch (error) {
    logger.error(`Error deleting flat with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};

export { deleteFlat, getFlatById, getFlats, saveFlat, updateFlat };

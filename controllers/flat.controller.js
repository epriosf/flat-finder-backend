import mongoose from 'mongoose';
import {
  deleteFlatService,
  getFlatByIdService,
  getFlatsByIdsService,
  getFlatsService,
  getUserFlatsService,
  saveFlatService,
  updateFlatService,
} from '../services/flat.service.js';
import logger from '../utils/logger.js';
import { flatSaveSchema, flatSchema } from '../validators/flat.validator.js';
const { ObjectId } = mongoose.Types;

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

    const { flats, pagination } = await getFlatsService(query);

    res.status(200).json({
      data: flats,
      pagination,
    });
  } catch (error) {
    logger.error(`Error fetching flats: ${error.message}`);
    next(error);
  }
};
const getUserFlats = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // Extract logged-in user ID
    const query = req.query; // Pass query parameters for filters, pagination, etc.

    // Call the service to fetch flats for the user
    const { flats, pagination } = await getUserFlatsService(userId, query);

    res.status(200).json({
      data: flats,
      pagination,
    });
  } catch (error) {
    logger.error(
      `Error fetching flats for user ${req.user.user_id}: ${error.message}`
    );
    next(error);
  }
};

const getFlatById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const flat = await getFlatByIdService(id);

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

const getFlatsByIds = async (req, res, next) => {
  try {
    const { ids } = req.query;

    // Ensure ids are provided
    if (!ids) {
      return res.status(400).json({ message: 'IDs are required' });
    }

    // Split and validate IDs
    const idArray = ids.split(',').map((id) => id.trim());
    const objectIds = idArray.map((id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
      return new ObjectId(id);
    });

    // Fetch flats using the service
    const { flats, pagination } = await getFlatsByIdsService(
      objectIds,
      req.query
    );

    res.status(200).json({ data: flats, pagination });
  } catch (error) {
    console.error(`Error fetching flats by IDs: ${error.message}`);
    next(error);
  }
};

const saveFlat = async (req, res, next) => {
  try {
    // Validate schema
    const { error } = flatSaveSchema.validate(req.body);
    if (error) {
      logger.warning(`Validation error for saveFlat: ${error.message}`);
      return res.status(400).json({ message: error.message });
    }

    // Extract ownerId from the token (req.user)
    const ownerId = req.user.user_id; // Assuming token has 'user_id'

    // Merge ownerId into the flat data
    const flatData = { ...req.body, ownerId };

    // Call the service to save the flat
    const newFlat = await saveFlatService(flatData);

    logger.info(`Flat created successfully with ID: ${newFlat._id}`);
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

    const { updatedFlat, message } = await updateFlatService(id, flatData);

    if (!updatedFlat) {
      logger.warning(`Flat not found for update with ID: ${id}`);
      return res.status(404).json({ message });
    }

    res.status(200).json({ message, data: updatedFlat });
  } catch (error) {
    logger.error(`Error updating flat with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};

const deleteFlat = async (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid or missing flat ID' });
  }

  try {
    const deletedFlat = await deleteFlatService(id);

    if (!deletedFlat) {
      logger.warning(`Flat not found or already deleted with ID: ${id}`);
      return res
        .status(404)
        .json({ message: 'Flat not found or already deleted' });
    }
    logger.info(`Flat deleted successfully with ID: ${id}`);

    res
      .status(200)
      .json({ message: 'Flat deleted successfully', data: deletedFlat });
  } catch (error) {
    logger.error(`Error deleting flat with ID: ${id}, Error: ${error.message}`);
    next(error);
  }
};

export {
  deleteFlat,
  getFlatById,
  getFlats,
  getFlatsByIds,
  getUserFlats,
  saveFlat,
  updateFlat,
};

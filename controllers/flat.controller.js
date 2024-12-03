import { buildFilters } from '../utils/filterBuilder.js';
import { flatSchema } from '../utils/flat.validator.js';
import { Flat } from './../models/flat.model.js';

const getFlats = async (req, res, next) => {
  try {
    // Validate query parameters
    const { value: query, error } = flatSchema.validate(req.query);
    if (error) {
      console.log(`Invalid query parameters: ${error.message}`);
      return res
        .status(400)
        .json({ message: `Invalid query parameters: ${error.message}` });
    }
    // Filters
    //  const filters = buildFilters(query);
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

    console.log(
      `Successfully fetched flats for page ${query.page} with limit ${query.limit}`
    );
  } catch (error) {
    next(error);
  }
};
const getFlatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flat = await Flat.findOne({ _id: id, deleted: { $eq: null } });

    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }

    res.status(200).json(flat);
  } catch (error) {
    next(error);
  }
};

const saveFlat = async (req, res, next) => {
  try {
    const { error } = flatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const newFlat = new Flat(req.body);
    await newFlat.save();
    res
      .status(201)
      .json({ message: 'Flat created successfully', data: newFlat });
  } catch (error) {
    next(error);
  }
};

const updateFlat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flatData = req.body;

    const updatedFlat = await Flat.findOneAndUpdate(
      { _id: id, deleted: { $eq: null } },
      flatData,
      { new: true }
    );

    if (!updatedFlat) {
      return res.status(404).json({ message: 'Flat not found' });
    }

    res
      .status(200)
      .json({ message: 'Flat updated successfully', data: updatedFlat });
  } catch (error) {
    next(error);
  }
};

const deleteFlat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFlat = await Flat.findOneAndUpdate(
      { _id: id, deleted: { $eq: null } },
      { deleted: new Date() },
      { new: true }
    );

    if (!deletedFlat) {
      return res
        .status(404)
        .json({ message: 'Flat not found or already deleted' });
    }
    res
      .status(200)
      .json({ message: 'Flat deleted successfully', data: deletedFlat });
  } catch (error) {
    next(error);
  }
};

export { deleteFlat, getFlatById, getFlats, saveFlat, updateFlat };

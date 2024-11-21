import { buildFilters } from '../utils/filterBuilder.js';
import { querySchema } from '../utils/flat.validator.js';
import { Flat } from './../models/flat.model.js';

const getFlats = async (req, res, next) => {
  try {
    // Validate query parameters
    const { value: query, error } = querySchema.validate(req.query);
    if (error) {
      console.log(`Invalid query parameters: ${error.message}`);
      return res
        .status(400)
        .json({ message: `Invalid query parameters: ${error.message}` });
    }
    // Filters
    const filters = buildFilters(query);
    //Sorting
    const sort = { [query.sort]: query.order === 'desc' ? -1 : 1 };

    const skip = (query.page - 1) * query.limit;

    const flats = await Flat.find(filters)
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
export { getFlats };

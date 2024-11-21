const buildFilters = (query) => {
  const filters = {};
  if (query.city) {
    filters.city = { $regex: query.city, $options: 'i' };
  }
  if (query.minRentPrice) {
    filters.rentPrice = { ...filters.rentPrice, $gte: query.minRentPrice };
  }
  if (query.maxRentPrice) {
    filters.rentPrice = { ...filters.rentPrice, $lte: query.maxRentPrice };
  }
  if (query.hasAc !== undefined) {
    filters.hasAc = query.hasAc ? 1 : 0;
  }
  return filters;
};
export { buildFilters };

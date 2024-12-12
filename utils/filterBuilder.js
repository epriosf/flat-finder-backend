const buildFlatFilters = (query) => {
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
const buildUserFilters = (query) => {
  const filters = {};
  if (query.firstName) {
    filters.firstName = { $regex: query.firstName, $options: 'i' };
  }
  if (query.lastName) {
    filters.lastName = { $regex: query.lastName, $options: 'i' };
  }
  if (query.isAdmin !== undefined) {
    filters.isAdmin = query.isAdmin ? 1 : 0;
  }
  return filters;
};
export { buildFlatFilters, buildUserFilters };

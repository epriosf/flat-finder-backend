import { Flat } from './../models/flat.model.js';

export const verifyFlatOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const flat = await Flat.findById(id);

    if (!flat) {
      return res.status(404).json({ message: 'Flat not found' });
    }
    if (flat.ownerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to perform this action' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

import logger from '../utils/logger.js';

export const verifySender = async (req, res, next) => {
  try {
    const { sender } = req.params;
    const userId = req.user.user_id;

    if (!sender) {
      return res.status(400).json({ message: 'Sender ID is required' });
    }

    if (sender !== userId.toString()) {
      logger.warning('Unauthorized access attempt', {
        sender,
        userId,
      });
      return res
        .status(403)
        .json({ message: 'You are not authorized to access these messages' });
    }

    next();
  } catch (error) {
    logger.error('Error in sender validation middleware', {
      error: error.message,
    });
    next(error);
  }
};

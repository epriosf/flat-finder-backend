import logger from '../utils/logger.js';

export const verifySender = async (req, res, next) => {
  try {
    const { senderId } = req.query;
    const userId = req.user.user_id;

    if (!senderId) {
      return res.status(400).json({ message: 'Sender ID is required' });
    }

    if (senderId !== userId.toString()) {
      logger.warning('Unauthorized access attempt', {
        senderId,
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

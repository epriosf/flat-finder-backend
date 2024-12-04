import logger from '../utils/logger.js';

const testLogs = async (req, res) => {
  try {
    logger.error('This is an error message');
    logger.warning('This is a warning message from logWarning controller');
    logger.info('This is an info message from logInfo controller');
    logger.debug('This is a debug');
    res.send({ message: 'Logs test' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export { testLogs };

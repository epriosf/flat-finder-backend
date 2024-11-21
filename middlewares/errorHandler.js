const errorHandler = (err, req, res) => {
  console.error('Error:', err.message || 'Unknown Error');

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || null,
  });
};

export default errorHandler;

module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports.middlewareErrors = (error, _, res, _a) => { 
    res.status(error.status || 500).json({
      success: false,
      error: {
        message: error.message || 'Internal failure error',
        statusCode: error.status || 500,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
}
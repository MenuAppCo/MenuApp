module.exports.middlewareNotFound = (_, res) => {
    res.status(404).json({
      success: false,
      error: {
        message: 'resoource_not_found',
        statusCode: 404
      }
    });
}
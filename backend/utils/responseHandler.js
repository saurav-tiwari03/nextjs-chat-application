
exports.successHandler = async (res, data, message = 'Success') => {
  return res.status(200).json({ message, data });
}

exports.errorHandler = async (res, error, message = 'Internal Server Error') => {
  return res.status(500).json({ message, error });
}
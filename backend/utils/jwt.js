const jwt = require('jsonwebtoken')

const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  generateAuthToken
};

const jwt = require('jsonwebtoken')

const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {});
};

const encryptAuthToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateAuthToken,
  encryptAuthToken
};

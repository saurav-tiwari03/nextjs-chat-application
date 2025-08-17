const router = require('express').Router();

const { login, register,userNameAvailable, searchUser } = require('../controllers/user.controller')

router.post('/login', login);
router.post('/register', register);
router.get('/check-username', userNameAvailable);
router.get('/search', searchUser);

module.exports = router;
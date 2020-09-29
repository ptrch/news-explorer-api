const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);
router.use('/users', auth, users);
router.use('/articles', auth, articles);

module.exports = router;
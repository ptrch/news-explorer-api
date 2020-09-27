const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const AuthorizationErr = require('../errors/AuthorizationErr');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequestErr('Введите пароль');
  }
  if (password.length < 8) {
    throw new BadRequestErr('Слишком короткий пароль');
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({
      name, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(err.message);
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictErr('Такой пользователь уже существует');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      throw new AuthorizationErr(err.message);
    })
    .catch(next);
};

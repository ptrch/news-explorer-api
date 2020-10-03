const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const AuthorizationErr = require('../errors/AuthorizationErr');
const { Message } = require('../errors/messages');

module.exports.getUser = (req, res, next) => {
  User.find({ _id: req.user._id }, { _id: false, email: true, name: true })
    .then((users) => res.send(users))
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequestErr(Message.inputPassword);
  }
  if (password.length < 8) {
    throw new BadRequestErr(Message.shotPassword);
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
        throw new ConflictErr(Message.userAlredyExists);
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

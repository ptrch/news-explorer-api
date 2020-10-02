const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const emailValid = require('validator').isEmail;
const { Message } = require('../errors/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => emailValid(v),
      message: Message.invalidLink,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function check(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(Message.incorEmailPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(Message.incorEmailPassword));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);

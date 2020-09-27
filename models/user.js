const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const emailValid = require('validator').isEmail;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'это поле является обязательным'],
    minlength: [2, 'мин. количество символов - 2'],
    maxlength: [30, 'макс. количество символов - 30'],
  },
  email: {
    type: String,
    required: [true, 'это поле является обязательным'],
    unique: true,
    validate: {
      validator: (v) => emailValid(v),
      message: 'некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'это поле является обязательным'],
    minlength: [8, 'мин. количество символов - 8'],
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);

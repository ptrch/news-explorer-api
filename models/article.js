const mongoose = require('mongoose');
const urlValid = require('validator').isURL;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'это поле является обязательным'],
  },
  title: {
    type: String,
    required: [true, 'это поле является обязательным'],
  },
  text: {
    type: String,
    required: [true, 'это поле является обязательным'],
  },
  date: {
    type: String,
    required: [true, 'это поле является обязательным'],
  },
  source: {
    type: String,
    required: [true, 'это поле является обязательным'],
  },
  link: {
    type: String,
    required: [true, 'это поле является обязательным'],
    validate: {
      validator: (v) => urlValid(v),
      message: 'некорректная ссылка',
    },
  },
  image: {
    type: String,
    required: [true, 'это поле является обязательным'],
    validate: {
      validator: (v) => urlValid(v),
      message: 'некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'это поле является обязательным'],
  },
});

module.exports = mongoose.model('article', articleSchema);

const mongoose = require('mongoose');
const urlValid = require('validator').isURL;
const { Message } = require('../errors/messages');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlValid(v),
      message: Message.invalidLink,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlValid(v),
      message: Message.invalidLink,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);

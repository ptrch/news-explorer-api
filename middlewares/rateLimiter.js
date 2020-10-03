const rateLimit = require('express-rate-limit');
const { Message } = require('../errors/messages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: (Message.tooManyRequests),
});

module.exports = limiter;

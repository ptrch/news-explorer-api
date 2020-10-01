/// подключение
const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundErr = require('./errors/NotFoundErr');
const limiter = require('./middlewares/rateLimiter');
const { Message } = require('./errors/messages');

const { NODE_ENV, PORT = 3000, DB_ADDRESS } = process.env;
// создаем объект приложения
const app = express();
// подключим заголовки безопасности
app.use(helmet());
// подключаем парсеры
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// подключаемся к серверу MongoDB
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/news-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(limiter);
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(Message.serverFail);
  }, 0);
});
app.use(router);

app.use(() => {
  throw new NotFoundErr(Message.notFound);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? Message.serverError
        : message,
    });
  next();
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

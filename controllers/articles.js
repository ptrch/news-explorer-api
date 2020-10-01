const Article = require('../models/article');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const { Message } = require('../errors/messages');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticles = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(err.message);
      } else next(err);
    })
    .catch(next);
};

module.exports.delArticles = (req, res, next) => {
  Article.findOne({ _id: req.params.articleId, owner: req.user._id })
    .then(async (article) => {
      await Article.findByIdAndDelete({ _id: req.params.articleId });
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestErr(Message.delError);
      } if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundErr(Message.notFoundNews);
      } else next(err);
    })
    .catch(next);
};

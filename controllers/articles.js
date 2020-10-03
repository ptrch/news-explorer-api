const Article = require('../models/article');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
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
  Article.findById(req.params.articleId)
    .orFail(new NotFoundErr(Message.articleNotFound))
    .then((article) => {
      const { owner } = article;
      if (req.user._id === owner.toString()) {
        Article.deleteOne(article)
          .then(() => res.status(200).send({ message: Message.articleDeleted }));
      } else {
        throw new ForbiddenErr(Message.articleForbidden);
      }
    })
    .catch(next);
};

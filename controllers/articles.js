const Article = require('../models/article');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticles = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
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
    .then(async (article) => {
      const userId = req.user._id;
      const ownerId = article.owner._id.toString();
      if (ownerId === userId) {
        res.send({ data: await Article.findByIdAndDelete(req.params.articleId) });
      } throw new ForbiddenErr('Вы не можете удалить чужую карточку');
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'TypeError') {
        throw new BadRequestErr('Не удалось удалить карточку. Запрашиваемый ресурс не найден');
      } else next(err);
    })
    .catch(next);
};

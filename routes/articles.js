const router = require('express').Router();
const urlValid = require('validator').isURL;
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticles, delArticles } = require('../controllers/articles');
const BadRequestErr = require('../errors/BadRequestErr');
const { Message } = require('../errors/messages');

router.get('/', getArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.required().custom((value) => {
      if (!urlValid(value)) {
        throw new BadRequestErr(Message.invalidLink);
      } else {
        return value;
      }
    }),
    image: Joi.required().custom((value) => {
      if (!urlValid(value)) {
        throw new BadRequestErr(Message.invalidLink);
      } else {
        return value;
      }
    }),
  }),
}), createArticles);
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().length(24).hex(),
  }),
}), delArticles);

module.exports = router;

const Router = require('express')
const CardController = require('../controllers/CardController')
const { celebrate, Joi } = require('celebrate');

const router = new Router()

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(4).max(30),
    link: Joi.string().required().min(4)
  })
}), CardController.create)
router.get('/', CardController.getUsersCard)
router.get('/:cardId', CardController.getOne)
router.put('/', CardController.update)
router.delete('/:cardId', CardController.delete)
router.put('/:cardId/likes', CardController.like)
router.delete('/:cardId/likes', CardController.dislike)

module.exports = router
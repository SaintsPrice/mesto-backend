const Router = require('express')
const UserController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/auth')

const router = new Router()

router.get('/', UserController.getAll)
router.get('/me/:id', UserController.getOne)
router.patch('/me', UserController.update)
router.patch('/me/avatar', UserController.updateAvatar)

module.exports = router
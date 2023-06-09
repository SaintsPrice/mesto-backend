const User = require('../models/user')

class UserController {
  async getAll(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      if(!id) {
        return res.status(400).json({message: 'id не указан'})
      }
      const user = await User.findById(id)
      return res.json(user)
    }
    catch(e) {
      return res.status(500).json(e)
    }
  }

  async update(req, res, next) {
    try {
      const updateUser = req.body

      const userId = req.user.id
      if(!userId) {
        return res.status(400).json({message: 'id не указан'})
      }
      const updatedUser = await User.findByIdAndUpdate(userId, updateUser, {new: true})
      return res.json(updatedUser)
    }
    catch(e) {
      next(e)
    }
  }

  async updateAvatar(req, res) {
    try {
      const {avatar} = req.body

      const userId = req.user.id
      if(!userId) {
        return res.status(400).json({message: 'id не указан'})
      }
      const updatedUserAvatar = await User.findByIdAndUpdate(userId, {avatar}, {new: true})
      return res.json(updatedUserAvatar)
    }
    catch(e) {
      return res.status(500).json(e)
    }
  }
}

module.exports = new UserController()
const Card = require('../models/card')

class CardController {
  async create(req, res, next) {
    try {
      const {name, link} = req.body
      const newCard = await Card.create({name, link, owner: req.user.id})

      return res.json(newCard)
    }
    catch(e) {
      console.log(e)
      next(e)
    }
  }

  async getAll(req, res) {
    try {
      const cards = await Card.find()

      return res.json(cards)
    }
    catch(e) {
      res.status(500).json(e)
    }
  }

  async getUsersCard(req, res) {
    try {
      const cards = await Card.find({owner: req.user.id})

      return res.json(cards)
    }
    catch(e) {
      res.status(500).json(e)
    }
  }

  async getOne(req, res) {
    try {
      const {id} = req.params
      if(!id) {
        return res.status(400).json({message: 'id не указан'})
      }
      const card = await Card.findById(id)
      return res.json(card)
    }
    catch(e) {
     res.status(500).json(e)
    }
  }

  async update(req, res) {
    try {
      const updateCard = req.body
      if(!updateCard._id) {
        return res.status(400).json({message: 'id не указан'})
      }

      const updatedCard = await Card.findByIdAndUpdate(updateCard._id, updateCard, {new: true})
      return res.json(updatedCard)
    }
    catch(e) {
      return res.status(500).json(e)
    }
  }

  async delete(req, res) {
    try {
      const {cardId} = req.params
      if(!cardId) {
        return res.status(400).json({message: 'id не существует'})
      }
      const deletedCard = await Card.findByIdAndDelete(cardId)

      return res.json(deletedCard)


    }
    catch(e) {
      res.status(500).json(e)
    }
  }

  async like(req, res) {
    try {
      const {cardId} = req.params
      if(!cardId) {
        return res.status(400).json({message: 'id не существует'})
      }
      const likedCard = await Card.findByIdAndUpdate(cardId, {$addToSet: {likes: req.user.id}}, {new: true})

      return res.json(likedCard)
    }
    catch(e) {
      return res.status(500).json(e)
    }
  }

  async dislike(req, res) {
    try {
      const {cardId} = req.params
      if(!cardId) {
        return res.status(400).json({message: 'id не существует'})
      }
      const dislikedCard = await Card.findByIdAndUpdate(cardId, {$pull: {likes: req.user.id}}, {new: true})

      return res.json(dislikedCard)
    }
    catch(e) {
      return res.status(500).json(e)
    }
  }
}

module.exports = new CardController()
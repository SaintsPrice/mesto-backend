const User = require('../models/user');
const Token = require('../models/token')
const jwt = require('jsonwebtoken');
const {SECRET_ACCESS_KEY, SECRET_REFRESH_KEY} = require('../config');

class TokenService {
  generateTokens(id, email) {
    const payload = {
      id,
      email
    }
    const accessToken = jwt.sign(payload, SECRET_ACCESS_KEY, {expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, SECRET_REFRESH_KEY, {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try{
      const userData = jwt.verify(token, SECRET_ACCESS_KEY)

      return userData
    }
    catch(e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try{
      const userData = jwt.verify(token, SECRET_REFRESH_KEY)

      return userData
    }
    catch(e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({user: userId})
    if(tokenData) {
    tokenData.refreshToken = refreshToken
    return tokenData.save()
  }
  const token = await Token.create({user: userId, refreshToken})
  return token
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({refreshToken})

    return tokenData
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({refreshToken})

    return tokenData
  }
}

module.exports = new TokenService()
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const TokenService = require('../service/token-service');
const ApiError = require('../error/ApiError')

class LoginService {
  async registration(email, password) {
    const candidate = await User.findOne({email})
    if(candidate) {
      throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({email, password: hash})

    const tokens = TokenService.generateTokens(user._id, email)
    await TokenService.saveToken(user._id, tokens.refreshToken)

    return {
      ...tokens,
      user: {
        id: user._id,
        email
      }
    }
  }

  async login(email, password) {
    const user = await User.findOne({email}).select('+password')
    if(!user) {
      throw ApiError.badRequest('Пользователь с таким email не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals) {
      throw ApiError.badRequest('Введен неверный пароль')
    }
    const tokens = TokenService.generateTokens(user._id, email)
    await TokenService.saveToken(user._id, tokens.refreshToken)

    return {
      ...tokens,
      user: {
        id: user._id,
        email
      }
    }
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await TokenService.findToken(refreshToken)

    if(!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await User.findById(userData.id)
    const tokens = TokenService.generateTokens(user._id, user.email)
    await TokenService.saveToken(user._id, tokens.refreshToken)

    return {
      ...tokens,
      user: {
        id: user._id,
        email: user.email
      }
    }
  }
}

module.exports = new LoginService()
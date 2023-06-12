const LoginService = require('../service/login-service')

class LoginController {
  async registration(req, res, next) {
    try {
      const {email, password} = req.body
      const userData = await LoginService.registration(email, password)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*50*60*1000, httpOnly: true})
      return res.json(userData)
    }
     catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body
      const userData = await LoginService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
      return res.json(userData)
    }
    catch(e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const token = await LoginService.logout(refreshToken)
      res.clearCookie('refreshToken')

      return res.json(token)
    }
    catch(e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const userData = await LoginService.refresh(refreshToken)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true})
      return res.json(userData)
    }
    catch(e) {
      next(e)
    }
  }
}

module.exports = new LoginController()
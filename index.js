require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const LoginController = require('./controllers/LoginController');
const authMiddleware = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/ErrorHandlingMidlleware');
const { celebrate, Joi } = require('celebrate');

const { PORT, MONGO_URI, CLIENT_URL } = process.env;

const app = express()

app.use(cors({
  credentials: true,
  origin: true,
  
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json())


app.use('/api', authMiddleware, router)

app.use(ErrorHandler)

app.get('/', (req, res) => {
  res.status(200).json({message: 'Сервер запущен'})
})
app.post('/signin', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(30)
  })
}), LoginController.login)
app.post('/signup', celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(30)
  })
}), LoginController.registration)
app.post('/logout', LoginController.logout)
app.get('/refresh', LoginController.refresh)

start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT, () => console.log(`Сервер успешно запущен на порту ${PORT}`))
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

start()


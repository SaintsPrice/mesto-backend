const {mongoose, Schema, model } = require("mongoose");
const isValid = require('validator');

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate:
      function validitor(v) {
        return /[\^http\-^https]:\/\/[www]?[a-zA-Z0-9_]/g.test(v)
      },
      message: 'Укажите правильный источник'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return isValid.isEmail(email)
      },
      message: 'Укажите правильный email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

module.exports = model('user', userSchema);
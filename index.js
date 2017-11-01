require('dotenv').config()
require('babel-register')({
  presets: ['env'],
})
require('./src/server')

require('dotenv').config()
require('babel-polyfill')
require('babel-register')({
  presets: ['env'],
  plugins: ['transform-object-rest-spread'],
})
require('./src/server')

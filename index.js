require('dotenv').config()
require('babel-polyfill')
require('babel-register')({
  presets: ['flow', 'env'],
  plugins: ['transform-object-rest-spread'],
})
require('~')

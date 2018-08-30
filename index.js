process.env.TZ = process.env.TIMEZONE || 'Europe/Berlin'
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const router = express.Router()
i18n = require('i18n')
pino = require('pino')()

const { Question } = require('./models/index')
const im = require('./im-interface')
const bot = require('./bot')
const queue = require('./utils/queue')

mongoose.connect('mongodb://localhost/dailydroid')

i18n.configure({
  locales: ['en', 'de'],
  directory: __dirname + '/locales',
  objectNotation: true
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(function(req, res, next) {
  console.log('REQ', req)
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

restify.serve(router, Question)

app.use(router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

im.bootstrap(app, queue)

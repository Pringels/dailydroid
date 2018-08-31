process.env.TZ = process.env.TIMEZONE || 'Europe/Berlin'
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const router = express.Router()
i18n = require('i18n')
pino = require('pino')()

const { Question, User, Update } = require('./models/index')
const im = require('./im-interface')
const bot = require('./bot')
const queue = require('./utils/queue')
const adminInterface = require('./admin-interface')

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
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  setTimeout(() => next(), 300)
})

restify.serve(router, Question)
restify.serve(router, User)
restify.serve(router, Update)

app.use(router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/v1/user-list', async (req, res) => {
  const users = await im.userList()
  res.send(users)
})

app.post('/api/v1/user-register', (req, res) => {
  adminInterface.registerUser(req.body.user)
  setTimeout(() => res.status(201).send(), 300)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

im.bootstrap(app, queue)

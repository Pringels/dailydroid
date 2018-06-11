require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
i18n = require('i18n')
pino = require('pino')()

const { Channel, User } = require('./models/index')
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

app.get('/', (req, res) => {
  console.log('Hi')
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

im.bootstrap(app, queue)

module.exports = {
  doSomething: x => x + 2
}

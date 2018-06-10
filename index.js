require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dailydroid')
i18n = require('i18n')

i18n.configure({
  locales: ['en', 'de'],
  directory: __dirname + '/locales',
  objectNotation: true
})

const im = require('./im-interface')

const bot = require('./bot')

const express = require('express')
const app = express()

const { Channel, User } = require('./models/index')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

im.bootstrap(app)

app.get('/', (req, res) => {
  console.log('Hi')
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = {
  doSomething: x => x + 2
}

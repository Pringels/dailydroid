process.env.TZ = process.env.TIMEZONE || 'Europe/Berlin'
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
  console.log('Hi')
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

im.bootstrap(app, queue)

const initialQuestions = async () => {
  const question = new Question({
    text: 'What did you work on yesterday?',
    order: 0,
    days: [0, 1, 2, 3, 4, 5, 6]
  })

  const question2 = new Question({
    text: 'What will you work on today?',
    order: 1,
    days: [0, 1, 2, 3, 4, 5, 6]
  })

  const question3 = new Question({
    text: 'Any blockers?',
    order: 2,
    days: [0, 1, 2, 3, 4, 5, 6]
  })

  question.save()
  question2.save()
  question3.save()
}

//initialQuestions()

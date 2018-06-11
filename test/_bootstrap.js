require('dotenv').config()

process.env.SLACK_MESSAGE_DELAY = 0

var mongoose = require('mongoose')
var Mockgoose = require('mockgoose').Mockgoose
var mockgoose = new Mockgoose(mongoose)
i18n = require('i18n')

mockgoose.prepareStorage().then(function() {
  mongoose.connect('mongodb://localhost/dailydroid')
})

i18n.configure({
  locales: ['en', 'de'],
  directory: '../locales',
  objectNotation: true
})

const express = require('express')
const kue = require('kue')

i18n = require('i18n')
pino = require('pino')()

const { Channel, User } = require('../models/index')
const im = require('../im-interface')
const bot = require('../bot')
q = kue.createQueue()
q.testMode.enter(true)

const queue = {
  add: (name, data) => {
    console.log('CREADTING', name)
    q.create(name, data).save()
  },
  process: (name, cb) =>
    q.process(name, (job, done) => {
      cb(job.data, done)
    })
}

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.listen(3000, () => console.log('Testing app listening on port 3000!'))

im.bootstrap(app, queue)

module.exports = {
  doSomething: x => x + 2
}

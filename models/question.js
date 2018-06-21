const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const questionSchema = Schema({
  text: String,
  order: Number,
  days: [Number]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = {
  Question
}

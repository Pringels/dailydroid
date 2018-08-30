const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const questionSchema = Schema({
  text: String,
  updateLabel: String,
  color: { type: String, default: '#aaffaa' },
  order: Number,
  days: [Number]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = {
  Question
}

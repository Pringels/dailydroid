const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const questionSchema = Schema({
  text: String,
  days: [String]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = {
  Question
}

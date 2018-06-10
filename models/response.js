const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const responseSchema = Schema({
  test: String,
  question: { type: Schema.Types.ObjectId, ref: 'Question' }
})

const Response = mongoose.model('Response', responseSchema)

module.exports = {
  Response
}

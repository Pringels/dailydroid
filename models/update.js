const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const updateSchema = new Schema({
  timestamp: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  completed: { type: Boolean, default: false },
  responses: [{ type: Schema.Types.ObjectId, ref: 'Response' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
})

const Update = mongoose.model('Update', updateSchema)

module.exports = {
  Update
}

const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const userSchema = new Schema({
  platformId: String,
  displayName: String,
  updateTime: { type: String, default: '09:00' },
  updateActive: { type: Boolean, default: false },
  updates: [{ type: Schema.Types.ObjectId, ref: 'Update' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  dm: { type: Schema.Types.ObjectId, ref: 'Channel' }
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User
}

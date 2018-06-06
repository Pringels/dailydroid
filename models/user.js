const mongoose = require('mongoose')

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const userSchema = new Schema({
  platformId: String,
  displayName: String,
  updateTime: { type: String, default: '9:00' },
  updateActive: { type: Boolean, default: false },
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  dm: { type: Schema.Types.ObjectId, ref: 'Channel' }
})

const channelSchema = Schema({
  platformId: String
})

const User = mongoose.model('User', userSchema)
const Channel = mongoose.model('Channel', channelSchema)

module.exports = {
  User,
  Channel
}

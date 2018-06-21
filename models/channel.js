const mongoose = require('mongoose')
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId

const channelSchema = Schema({
  name: String,
  platformId: String
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = {
  Channel
}

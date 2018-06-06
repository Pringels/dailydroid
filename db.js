const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/my_database')

const { Channel, User } = require('./models/user')

const user = new User({
  platformId: 'USERIDSLACK',
  displayName: 'PETER',
  updateTime: '8:30',
  updateActive: false,
  channels: [
    new Channel({
      platformId: 'SOME_CHANNEL'
    })
  ],
  dm: new Channel({
    platformId: 'SOME_DM'
  })
})
//user.save().then(() => console.log('user saved'))

// User.deleteOne({ platformId: 'UB11PFQ30' }).then(res => {
//   console.log('DELETED PETER')
// })

User.find().then(users => {
  console.log('USERS', users)
})

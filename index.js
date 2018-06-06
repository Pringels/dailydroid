require('dotenv').config()
require('./db')

const { pipe, filter } = require('rxjs/operators')

const interfaces = require('./interfaces')

const express = require('express')
const app = express()

const { Channel, User } = require('./models/user')

app.use(express.json())
interfaces.bootstrap(app)

app.get('/', (req, res) => {
  console.log('Hi')
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

interfaces.slackInterface.messages$
  .pipe(filter(event => event.user === 'UB11PFQ30'))
  .subscribe(async event => {
    //console.log('USER', event)
    const userInfo = await interfaces.slackInterface.userInfo(event.user)
    const user = new User({
      platformId: event.user,
      displayName: userInfo.user.profile.display_name,
      updateTime: '8:30',
      updateActive: false,
      channels: [],
      dm: new Channel({
        platformId: event.channel
      })
    })
    user.save().then(() => console.log('user saved'))
    interfaces.slackInterface.send({
      channel: event.channel,
      text: 'you would like to register!'
    })
  })

module.exports = {
  doSomething: x => x + 2
}

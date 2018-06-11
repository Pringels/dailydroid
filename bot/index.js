const { User, Response, Channel } = require('../models')
const im = require('../im-interface')

const { pipe, filter, map, mergeMap } = require('rxjs/operators')

const { newUserMessages$, existingUserMessages$ } = require('./streams')

newUserMessages$.subscribe(async ([event, _]) => {
  const userPlatformInfo = await im.userInfo(event.user)
  const user = new User({
    platformId: event.user,
    displayName: userPlatformInfo.user.profile.display_name,
    dm: new Channel({
      platformId: event.channel
    })
  })
  await user.save()
  im.send({
    channel: event.channel,
    text: i18n.__(
      'greeting.initial',
      userPlatformInfo.user.profile.display_name
    )
  })
})

existingUserMessages$.subscribe(async ([event, user]) => {
  const userPlatformInfo = await im.userInfo(event.user)
  const channelList = await im.channelList()
  im.send({
    channel: event.channel,
    text: i18n.__('greeting.familiar', user.displayName),
    attachments: im.generateAttachments('channelSelect', {
      channels: channelList.channels
    })
  })
})

// userMessages$.subscribe(async ([event, userQuery]) => {
//   const userPlatformInfo = await im.userInfo(event.user)
//   let user = await userQuery.exec()

//   console.log('USER', user)

//   if (!user) {
//     im.send({
//       channel: event.channel,
//       text: 'It looks like you have not registered before. Would you like to?'
//     })
//   }

//   //user.save().then(() => console.log('user saved'))
//   // im.send({
//   //   channel: event.channel,
//   //   text: 'you would like to register!'
//   // })
//   return true
// })

// const updateMessages$ =

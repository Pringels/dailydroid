const im = require('../im-interface')
const scheduler = require('./scheduler')

const { User, Channel, Update, Question, Response } = require('../models')
const { actionStreams, messageStreams } = require('./streams')
const messages = require('./messages')

// Handle incoming messages
messageStreams.newUserMessages$.subscribe(async ([event, _]) => {
  const userPlatformInfo = await im.userInfo(event.user)
  const dm = new Channel({
    platformId: event.channel
  })
  await dm.save()
  const user = new User({
    platformId: event.user,
    displayName: userPlatformInfo.user.profile.display_name,
    dm
  })
  await user.save()
  scheduler.add(user)
  im.send(
    messages.greeting(event.channel, userPlatformInfo.user.profile.display_name)
  )
})

messageStreams.inactiveUpdateMessages$.subscribe(async ([event, user]) => {
  const userPlatformInfo = await im.userInfo(event.user)
  const channelList = await im.channelList()
  //im.broadcast(user, user.updates[0])
  im.send(messages.options(user, event.channel, []))
})

/**
 * Options menu
 */
actionStreams.optionsChannelSelect$.subscribe(
  async ({ payload, respond, user }) => {
    console.log('CHANNEL SELECT', payload)
    const channelList = await im.channelList()
    const channels = channelList.channels.filter(
      channel =>
        !user.channels
          .map(userChannel => userChannel.platformId)
          .includes(channel.id)
    )
    const userChannels = channelList.channels.filter(channel =>
      user.channels
        .map(userChannel => userChannel.platformId)
        .includes(channel.id)
    )
    im.send(
      messages.channelSelect(user, user.dm.platformId, channels, userChannels)
    )
  }
)

actionStreams.optionsModifyUpdateTime$.subscribe(
  ({ payload, respond, user }) => {
    im.send(messages.modifyUpdateTime(user.dm.platformId, user.updateTime))
  }
)

actionStreams.optionsDeregister$.subscribe(
  async ({ payload, respond, user }) => {
    await User.deleteOne({ platformId: user.platformId }).exec()
    respond(messages.deregisterConfirm(user.displayName))
  }
)

/**
 * Edit channels
 */
actionStreams.channelSelect$.subscribe(async ({ payload, respond, user }) => {
  const id = payload.actions[0].selected_options[0].value
  const channelList = await im.channelList()
  const channelName = channelList.channels.find(channel => channel.id === id)
    .name
  const channel = await Channel.findOneAndUpdate(
    { platformId: id, name: channelName },
    {},
    { upsert: true, new: true }
  ).exec()

  user.channels.push(channel)
  await user.save()
  respond(messages.channelSelectConfirm(channelName))
})

actionStreams.channelDelete$.subscribe(async ({ payload, respond, user }) => {
  const id = payload.actions[0].value
  const channel = await Channel.findOne({ platformId: id }).exec()
  if (channel) {
    user.channels.pull(channel)
    await user.save()
    respond(messages.channelDeleteConfirm(channel.name))
  }
})

/**
 * Edit update time
 */
actionStreams.modifyUpdateTime$.subscribe(
  async ({ payload, respond, user }) => {
    const time = payload.actions[0].selected_options[0].value
    user.updateTime = time
    await user.save()
    scheduler.add(user)
    respond(messages.modifyUpdateTimeConfirm(time))
  }
)

/**
 * Updates
 */
scheduler.updates$.subscribe(async ({ data, done }) => {
  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const today = now.getDay()

  const user = await User.findById(data.userId)
    .populate('dm')
    .exec()

  const update = user.updates[0]
  if (!user.updateActive) {
    const questions = await Question.find({ days: today })
      .sort({ order: 1 })
      .exec()
    const update = await new Update({
      user,
      questions
    }).save()
    user.updateActive = true
    user.updates.push(update)
    await user.save()
    im.send(messages.question(user.dm.platformId, questions[0].text))
    done()
  }
})

messageStreams.activeUpdateMessages$.subscribe(async ([event, user]) => {
  let update = user.updates[0]
  if (update) {
    const questions = update.questions.filter(
      question =>
        !update.responses.some(response => question.id == response.question.id)
    )
    const response = new Response({
      text: event.text,
      question: questions[0]
    })
    await response.save()
    update.responses.push(response)
    await update.save()

    questions.shift()
    if (questions.length) {
      im.send(messages.question(user.dm.platformId, questions[0].text))
    } else {
      update.completed = true
      user.updateActive = false
      await update.save()
      await user.save()
      update = await Update.findById(update.id)
        .populate({ path: 'responses', populate: { path: 'question' } })
        .exec()
      im.send(messages.updateComplete(user.dm.platformId, user.displayName))
      im.broadcast({ user, update })
    }
  } else {
    /**
     * We expect a user to have at least one update if they are currently in
     * "active update" mode. If not, then something must have messed up the
     * state, so we reset it silently. This should never happen, but we guard
     * against it anyway.
     */
    user.updateActive = false
    await user.save()
  }
})

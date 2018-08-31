const { WebClient } = require('@slack/client')
const { Observable } = require('rxjs')

const { createSlackEventAdapter } = require('@slack/events-api')
const { createMessageAdapter } = require('@slack/interactive-messages')

const attachments = require('./attachments')

const slackEvents = createSlackEventAdapter(
  process.env.SLACK_VERIFICATION_TOKEN
)
const slackInteractions = createMessageAdapter(
  process.env.SLACK_VERIFICATION_TOKEN
)

let queue
const delay = process.env.SLACK_MESSAGE_DELAY || 1000

const bootstrap = (app, q) => {
  app.use('/slack/actions', slackInteractions.expressMiddleware())
  app.use('/slack/events', slackEvents.expressMiddleware())
  queue = q
  startProcessingQueue()
}

const startProcessingQueue = () => {
  queue.process('message.send', ({ channel, text, attachments }, done) => {
    web.chat
      .postMessage({ channel, text, attachments })
      .then(setTimeout(done, delay))
      .catch(e => pino.error(e))
  })
}

const token = process.env.SLACK_TOKEN
const web = new WebClient(token)

const send = payload => queue.add('message.send', payload)

const broadcast = ({ user, update }) => {
  user.channels.map(channel => {
    queue.add('message.send', {
      channel: channel.platformId,
      text: `updates for <@${user.displayName}>`,
      attachments: generateAttachments('broadcastUpdate', {
        user,
        update
      })
    })
  })
}

const messages$ = Observable.create(observer =>
  slackEvents.on('message', event => observer.next(event))
)

const selectAction$ = Observable.create(observer =>
  slackInteractions.action({ type: 'select' }, (payload, respond) => {
    observer.next({ payload, respond })
  })
)

const buttonAction$ = Observable.create(observer =>
  slackInteractions.action({ type: 'button' }, (payload, respond) => {
    observer.next({ payload, respond })
  })
)

const userInfo = user => web.users.info({ user })
const userList = () => web.users.list()
const openDm = user => web.im.open({ user, return_im: true })

const channelList = () => web.channels.list()

const generateAttachments = (type, data) => {
  return attachments[type](data)
}

module.exports = {
  messages$,
  selectAction$,
  buttonAction$,
  send,
  broadcast,
  userInfo,
  openDm,
  userList,
  channelList,
  bootstrap,
  generateAttachments
}

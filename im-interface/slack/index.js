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
    console.log('SENDING', channel, text, attachments)
    web.chat
      .postMessage({ channel, text, attachments })
      .then(setTimeout(done, delay))
      .catch(e => pino.error(e))
  })
}

const token = process.env.SLACK_TOKEN
const web = new WebClient(token)

const send = payload => queue.add('message.send', payload)

const broadcast = (user, updates) => {
  user.channels.map(channel => {
    queue.add('message.send', {
      channel: channel.platformId,
      text: `updates for ${user.displayName}`
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
  channelList,
  bootstrap,
  generateAttachments
}

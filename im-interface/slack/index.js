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

const bootstrap = app => {
  app.use('/slack/actions', slackInteractions.expressMiddleware())
  app.use('/slack/events', slackEvents.expressMiddleware())
}

const token = process.env.SLACK_TOKEN
const web = new WebClient(token)

const send = ({ channel, text, attachments }) =>
  web.chat
    .postMessage({ channel, text, attachments })
    .then(res => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts)
    })
    .catch(console.error)

const messages$ = Observable.create(observer =>
  slackEvents.on('message', event => observer.next(event))
)

const selectAction$ = Observable.create(observer =>
  slackInteractions.action({ type: 'select' }, (payload, respond) => {
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
  send,
  userInfo,
  channelList,
  bootstrap,
  generateAttachments
}

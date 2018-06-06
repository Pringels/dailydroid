const { WebClient } = require('@slack/client')
const { Observable } = require('rxjs')

const createSlackEventAdapter = require('@slack/events-api')
  .createSlackEventAdapter
const slackEvents = createSlackEventAdapter(
  process.env.SLACK_VERIFICATION_TOKEN
)

const bootstrap = app => {
  app.use('/slack/events', slackEvents.expressMiddleware())
}

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_TOKEN

const web = new WebClient(token)

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'DB1ENQ04E'

const send = ({ channel, text }) =>
  web.chat
    .postMessage({ channel, text })
    .then(res => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts)
    })
    .catch(console.error)

const messages$ = Observable.create(observer =>
  slackEvents.on('message', event => observer.next(event))
)

const userInfo = user => web.users.info({ user })

module.exports = {
  messages$,
  send,
  userInfo,
  bootstrap,
  url: '/slack/events'
}

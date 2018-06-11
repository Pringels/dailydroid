const delay = require('delay')
const { expect } = require('chai')

const payload = {
  token: process.env.SLACK_VERIFICATION_TOKEN,
  team_id: 'TB08XT3K7',
  api_app_id: 'AB0HUE4LS',
  event: {
    type: 'message',
    user: 'UB11PFQ30',
    text: 'test',
    client_msg_id: 'd940e353-a27a-4c3d-8612-89d750447965',
    ts: '1528748700.000677',
    channel: 'DB1ENQ04E',
    event_ts: '1528748700.000677',
    channel_type: 'im'
  },
  type: 'event_callback',
  event_id: 'EvB52L04QH',
  event_time: 1528748700,
  authed_users: ['UB11PFQ30', 'UAZSS9F8Q']
}

describe('a suite of tests', () => {
  let slackMock
  const botToken = 'xoxb-XXXXXXXXXXXX-TTTTTTTTTTTTTT'

  before(function() {
    this.timeout(3000)

    slackMock = require('slack-mock')()
    slackMock.reset()
    slackMock.web.addResponse({
      url: 'https://slack.com/api/channels.list',
      status: 200,
      body: {
        ok: true,
        channels: [
          {
            name: 'foo',
            id: 'ASDB'
          }
        ]
      }
    })
    slackMock.web.addResponse({
      url: 'https://slack.com/api/chat.postMessage',
      status: 200,
      body: {
        ok: true
      }
    })
    slackMock.web.addResponse({
      url: 'https://slack.com/api/users.info',
      status: 200,
      body: {
        ok: true,
        user: { profile: { display_name: 'john smith' } }
      }
    })
    require('./_bootstrap')
  })

  afterEach(function() {
    q.testMode.clear()
  })

  after(function() {
    q.testMode.exit()
  })

  it('should send a message', function(done) {
    slackMock.events
      .send('http://localhost:3000/slack/events', payload)
      .then(() => {
        setTimeout(() => {
          console.log('CALLS', slackMock.events.calls)
          expect(slackMock.events.calls).to.have.length(1)
          const firstCall = slackMock.events.calls[0]
          expect(firstCall.statusCode).to.equal(200)
          done()
        }, 1000)
      })
      .catch(e => {
        console.log('e', e)
      })
  })
})

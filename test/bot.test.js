const delay = require('delay')
const { expect } = require('chai')

const { basicPayload, channelSelectPayload } = require('./payloads')

describe('the bot', () => {
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
    slackMock.interactiveButtons.addResponse({
      statusCode: 201
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
      .send('http://localhost:3000/slack/events', basicPayload)
      .then(() => {
        setTimeout(() => {
          expect(slackMock.events.calls).to.have.length(1)
          console.log('CALL', slackMock.events.calls)
          const firstCall = slackMock.events.calls[0]
          expect(firstCall.statusCode).to.equal(200)
          done()
        }, 1000)
      })
      .catch(e => {
        console.log('e', e)
      })
  })

  xit('should set the update time', function(done) {
    slackMock.reset()
    slackMock.events
      .send('http://localhost:3000/slack/events', channelSelectPayload)
      .then(() => {
        setTimeout(() => {
          expect(slackMock.events.calls).to.have.length(1)
          // const responseUrlCall = _.find(slackMock.interactiveButtons.calls, {
          //   type: 'response_url'
          // })
          //console.log('CALLS', slackMock.interactiveButtons.calls)
          const responseUrlCall = slackMock.events.calls.find(
            call => call.type === 'response_url'
          )
          console.log('CALL', responseUrlCall)
          expect(responseUrlCall.params.text).to.equal('foo')
          done()
        }, 1000)
      })
      .catch(e => {
        console.log('e', e)
      })
  })
})

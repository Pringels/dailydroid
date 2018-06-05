const slackInterface = require('./slack-interface')

const bootstrap = app => {
  if (process.env.SLACK_INTEGRATION) {
    app.use('/slack/events', slackInterface.middleware())
  }
}

module.exports = {
  bootstrap,
  slackInterface
}

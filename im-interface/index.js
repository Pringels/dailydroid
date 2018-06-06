let imInterface = {}

if (process.env.SLACK_INTEGRATION) {
  imInterface = require('./slack-interface')
}

module.exports = {
  ...imInterface
}

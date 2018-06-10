let imInterface = {}

if (process.env.SLACK_INTEGRATION) {
  imInterface = require('./slack')
}

module.exports = {
  ...imInterface
}

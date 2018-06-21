const im = require('../im-interface')

const greeting = (channel, name) => ({
  channel,
  text: i18n.__('greeting.initial', name)
})

/**
 * Options menu
 */
const options = (user, channel, options) => ({
  channel,
  text: i18n.__('greeting.familiar', user.displayName),
  attachments: im.generateAttachments('options', {
    options
  })
})

const channelSelect = (user, channel, channels, userChannels) => ({
  channel,
  text: i18n.__('greeting.familiar', user.displayName),
  attachments: im.generateAttachments('channelSelect', {
    channels,
    userChannels
  })
})

const modifyUpdateTime = (channel, currentTime) => ({
  channel,
  attachments: im.generateAttachments('modifyUpdateTime', {
    times: i18n.__('constants.updateTimes'),
    currentTime
  })
})

/**
 * Edit channels
 */
const channelSelectConfirm = channelName => ({
  text: i18n.__('options.channelSelect.added', channelName),
  mrkdwn: true
})

const channelDeleteConfirm = channelName => ({
  text: i18n.__('options.channelSelect.delete', channelName),
  mrkdwn: true
})

/**
 * Edit update time
 */
const modifyUpdateTimeConfirm = time => ({
  text: i18n.__('options.modifyUpdateTime.updated', time),
  mrkdwn: true
})

/**
 * De-regsiter
 */
const deregisterConfirm = name => ({
  text: i18n.__('options.deregister.success', name),
  mrkdwn: true
})

/**
 * Updates
 */
const question = (channel, text) => ({
  channel,
  text,
  mrkdwn: true
})

const updateComplete = (channel, name) => ({
  channel,
  text: i18n.__('options.updates.complete', name)
})

module.exports = {
  channelSelect,
  greeting,
  options,
  channelSelect,
  modifyUpdateTime,
  channelSelectConfirm,
  channelDeleteConfirm,
  modifyUpdateTimeConfirm,
  deregisterConfirm,
  question,
  updateComplete
}

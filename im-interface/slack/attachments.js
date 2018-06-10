const attachments = {
  channelSelect: ({ channels }) => [
    {
      fallback: 'Please select a channel',
      color: '#36a64f',
      callback_id: 'channelSelect',
      title: i18n.__('options.channelSelect.title'),
      text: i18n.__('options.channelSelect.text'),
      actions: [
        {
          name: 'channelSelect',
          text: 'Pick a channel...',
          type: 'select',
          options: channels.map(channel => ({
            text: `#${channel.name}`,
            value: channel.id
          }))
        }
      ]
    }
  ]
}

module.exports = attachments

const attachments = {
  options: options => [
    {
      fallback: 'What can I help you with?',
      color: '#36a64f',
      callback_id: 'options',
      title: i18n.__('options.general.title'),
      text: i18n.__('options.general.text'),
      actions: [
        {
          name: 'channelSelect',
          text: 'Edit my channels',
          type: 'button',
          value: 'channelSelect'
        },
        {
          name: 'modifyUpdateTime',
          text: 'Change my update time',
          type: 'button',
          value: 'modifyUpdateTime'
        },
        {
          name: 'deregister',
          text: 'De-register',
          type: 'button',
          style: 'danger',
          value: 'deregister',
          confirm: {
            title: i18n.__('options.deregister.title'),
            text: i18n.__('options.deregister.text'),
            ok_text: i18n.__('options.deregister.ok_text'),
            dismiss_text: i18n.__('options.deregister.dismiss_text')
          }
        }
      ]
    }
  ],
  channelSelect: ({ channels, userChannels }) => [
    {
      fallback: 'Please select a channel to add',
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
          })),
          confirm: {
            title: i18n.__('options.channelSelect.confirmAdd.title'),
            text: i18n.__('options.channelSelect.confirmAdd.text'),
            ok_text: i18n.__('options.channelSelect.confirmAdd.ok_text'),
            dismiss_text: i18n.__(
              'options.channelSelect.confirmAdd.dismiss_text'
            )
          }
        }
      ]
    },
    {
      fallback: 'Please select a channel to delete',
      color: '#36a64f',
      title: i18n.__('options.channelSelect.deleteTitle'),
      text: i18n.__('options.channelSelect.deleteText'),
      callback_id: 'channelDelete',
      actions: userChannels.map(channel => ({
        name: 'channelDelete',
        text: `#${channel.name}`,
        type: 'button',
        value: channel.id,
        style: 'danger',
        confirm: {
          title: i18n.__('options.channelSelect.confirmDelete.title'),
          text: i18n.__('options.channelSelect.confirmDelete.text'),
          ok_text: i18n.__('options.channelSelect.confirmDelete.ok_text'),
          dismiss_text: i18n.__(
            'options.channelSelect.confirmDelete.dismiss_text'
          )
        }
      }))
    }
  ],

  modifyUpdateTime: ({ times, currentTime }) => [
    {
      fallback: 'Please pick a suitable time',
      color: '#36a64f',
      callback_id: 'modifyUpdateTime',
      title: i18n.__('options.modifyUpdateTime.title'),
      text: i18n.__('options.modifyUpdateTime.text', currentTime),
      actions: [
        {
          name: 'modifyUpdateTime',
          text: 'Pick a new time...',
          type: 'select',
          options: times.map(time => ({
            text: time,
            value: time
          }))
        }
      ]
    }
  ]
}

module.exports = attachments

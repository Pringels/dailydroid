module.exports = {
  basicPayload: {
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
  },

  channelSelectPayload: {
    token: '1ohSmM9m9QUjzIdvBRwkEgGV',
    team_id: 'TB08XT3K7',
    api_app_id: 'AB0HUE4LS',
    event: {
      type: 'interactive_message',
      actions: [
        {
          name: 'channelSelect',
          type: 'button',
          value: 'channelSelect'
        }
      ],
      callback_id: 'options',
      team: {
        id: 'TB08XT3K7',
        domain: 'dailydroid'
      },
      channel: {
        id: 'DCGFEAGQG',
        name: 'directmessage'
      },
      user: {
        id: 'UB11PFQ30',
        name: 'peterringelmann'
      },
      action_ts: '1535611827.468370',
      message_ts: '1535611768.000100',
      attachment_id: '1',
      token: '1ohSmM9m9QUjzIdvBRwkEgGV',
      is_app_unfurl: false,
      message: {
        text: 'What do you need help with Pete?',
        username: 'DailyDroid-local',
        bot_id: 'BCGKWGBJM',
        type: 'message',
        subtype: 'bot_message',
        ts: '1535611768.000100'
      },
      response_url:
        'https://hooks.slack.com/actions/TB08XT3K7/425305446960/1WU9TLyfaIHzNvWTSX8qbRfM',
      trigger_id: '427066208135.374303921653.fed5bbf066b30552f1cfb95d04d25215'
    },
    type: 'event_callback',
    event_id: 'EvB52L04QH',
    event_time: 1528748700,
    authed_users: ['UB11PFQ30', 'UAZSS9F8Q']
  }
}

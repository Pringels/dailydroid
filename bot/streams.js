const { User } = require('../models')
const { filter, map, mergeMap, tap, share } = require('rxjs/operators')
const { merge } = require('rxjs')
const im = require('../im-interface')

// Messages

const userMessages$ = im.messages$.pipe(
  filter(event => !event.bot_id),
  map(event => {
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    return [
      event,
      User.findOne({ platformId: event.user }).populate({
        path: 'updates dm channels',
        options: { created_on: startOfToday },
        populate: {
          path: 'questions responses'
        }
      })
    ]
  }),
  mergeMap(async ([event, userQuery]) => {
    const user = await userQuery.exec()
    return [event, user]
  }),
  share()
)

const newUserMessages$ = userMessages$.pipe(filter(([_, user]) => !user))

const existingUserMessages$ = userMessages$.pipe(filter(([_, user]) => user))

const activeUpdateMessages$ = existingUserMessages$.pipe(
  filter(([_, user]) => user.updateActive)
)

const inactiveUpdateMessages$ = existingUserMessages$.pipe(
  filter(([_, user]) => !user.updateActive)
)

// Actions
const actions$ = merge(im.selectAction$, im.buttonAction$)

const userActions$ = actions$.pipe(
  map(({ payload, respond }) => [
    payload,
    respond,
    User.findOne({ platformId: payload.user.id })
      .populate('dm')
      .populate('channels')
  ]),
  mergeMap(async ([payload, respond, userQuery]) => {
    const user = await userQuery.exec()
    return {
      payload,
      respond,
      user
    }
  }),
  share()
)

/**
 * Options menu
 */
const optionsMenu$ = userActions$.pipe(
  filter(({ payload }) => payload.callback_id === 'options')
)

const optionsChannelSelect$ = optionsMenu$.pipe(
  filter(({ payload }) => payload.actions[0].value === 'channelSelect')
)

const optionsModifyUpdateTime$ = optionsMenu$.pipe(
  filter(({ payload }) => payload.actions[0].value === 'modifyUpdateTime')
)

const optionsDeregister$ = optionsMenu$.pipe(
  filter(({ payload }) => payload.actions[0].value === 'deregister')
)

/**
 * Edit channels
 */
const channelSelect$ = userActions$.pipe(
  filter(({ payload }) => payload.callback_id === 'channelSelect')
)

const channelDelete$ = userActions$.pipe(
  filter(({ payload }) => payload.callback_id === 'channelDelete')
)

/**
 * Edit update time
 */
const modifyUpdateTime$ = userActions$.pipe(
  filter(({ payload }) => payload.callback_id === 'modifyUpdateTime')
)

module.exports = {
  messageStreams: {
    userMessages$,
    newUserMessages$,
    existingUserMessages$,
    inactiveUpdateMessages$,
    activeUpdateMessages$
  },
  actionStreams: {
    optionsMenu$,
    optionsChannelSelect$,
    optionsModifyUpdateTime$,
    optionsDeregister$,
    channelSelect$,
    channelDelete$,
    modifyUpdateTime$
  }
}

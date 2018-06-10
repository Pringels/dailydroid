const { User } = require('../models')
const { pipe, filter, map, mergeMap, tap } = require('rxjs/operators')
const im = require('../im-interface')

const userMessages$ = im.messages$.pipe(
  filter(event => !event.bot_id),
  map(event => [
    event,
    User.findOne({ platformId: event.user }).populate('updates')
  ]),
  mergeMap(async ([event, userQuery]) => {
    const user = await userQuery.exec()
    return [event, user]
  })
)

const existingUserMessages$ = userMessages$.pipe(
  filter(([event, user]) => user)
)
const newUserMessages$ = userMessages$.pipe(filter(([event, user]) => !user))

const actions$ = im.selectAction$.subscribe(({ payload, respond }) => {
  console.log('EVENT', payload)
  respond({ text: 'confirmed!' })
})

module.exports = {
  userMessages$,
  existingUserMessages$,
  newUserMessages$
}

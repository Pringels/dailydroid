const { Subject } = require('rxjs')

const requests$ = new Subject()

const registerUser = user => {
  requests$.next([{ type: 'registerNewUser', user }, null])
}

module.exports = {
  requests$,
  registerUser
}

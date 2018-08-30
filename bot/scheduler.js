const queue = require('../utils/queue')
const { Observable } = require('rxjs')

const findExistingJob = userId =>
  new Promise(resolve => {
    queue.delayed(function(err, ids) {
      ids.length
        ? ids.forEach(function(id) {
            queue.get(id, function(err, job) {
              if (job.data.userId === userId) {
                resolve(job)
              }
            })
          })
        : resolve()
    })
  })

const add = async user => {
  const timeString = user.updateTime
  const [_, hours, minutes] = /^(\d{2})\:(\d{2})$/g.exec(timeString)
  const now = new Date()

  const targetDate = new Date()
  targetDate.setHours(hours)
  targetDate.setMinutes(minutes)

  if (targetDate <= now) {
    targetDate.setDate(targetDate.getDate() + 1)
  }

  let existingJob = await findExistingJob(user.id)
  if (existingJob) {
    existingJob.delay(targetDate).save()
  } else {
    queue.delayedAdd('POST_UPDATE', { userId: user.id }, targetDate).save()
  }
}

const updates$ = Observable.create(observer =>
  queue.process('POST_UPDATE', (data, done) => {
    observer.next({ data, done })
  })
)

module.exports = {
  add,
  updates$
}

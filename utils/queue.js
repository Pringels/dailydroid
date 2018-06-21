const kue = require('kue')

const q = kue.createQueue()

kue.app.listen(3001)

module.exports = {
  add: (name, data, cb) => q.create(name, data).save(cb),
  delayedAdd: (name, data, delay, cb) =>
    q
      .create(name, data)
      .delay(delay)
      .save(cb),
  delayed: q.delayed.bind(q),
  get: kue.Job.get.bind(kue.Job),
  process: (name, cb) =>
    q.process(name, (job, done) => {
      cb(job.data, done)
    })
}

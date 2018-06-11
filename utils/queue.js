const kue = require('kue')

const q = kue.createQueue()

kue.app.listen(3001)

module.exports = {
  add: (name, data) => q.create(name, data).save(),
  process: (name, cb) =>
    q.process(name, (job, done) => {
      cb(job.data, done)
    })
}

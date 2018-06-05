require('dotenv').config()

const { pipe, filter } = require('rxjs/operators')

const interfaces = require('./interfaces')

const express = require('express')
const app = express()

app.use(express.json())
interfaces.bootstrap(app)

app.get('/', (req, res) => {
  console.log('Hi')
  res.send('Hello World!')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

interfaces.slackInterface.messages$
  .pipe(filter(event => event.user === 'UB11PFQ30'))
  .subscribe(event => {
    interfaces.slackInterface.send({
      channel: event.channel,
      text: 'Hey buddy'
    })
  })

module.exports = {
  doSomething: x => x + 2
}

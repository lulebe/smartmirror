const bodyParser = require('body-parser')
const app = require('express')()

const settingsRouter = require('./router_settings')
const miscRouter = require('./router_misc')

app.get('/', (req, res) => {
  res.send('mirror')
})

app.use(bodyParser.json())

app.use('/settings', settingsRouter)
app.use('/misc', miscRouter)

app.listen(3000, function () {
  console.log("listening on 3000")
})

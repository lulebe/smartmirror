const mdns = require('mdns')

var service = null

const start = (name) => {
  stop()
  const usingName = name || "new Mirror"
  service = new mdns.Advertisement(mdns.tcp('http'), 3000, {name: 'LuLeBe SM'+usingName}, (err, service) => {
    if (err)
      console.log(err)
  })
  service.start()
}

const stop = () => {
  if (service != null)
    service.stop()
  service = null
}

module.exports = {start, stop}

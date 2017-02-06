const exec = require('child_process').exec

let screenTimeout = null
let timeout = 300

function turnOff () {
  exec('xset -display :0.0 dpms force off')
}
function turnOn () {
  if (screenTimeout != null)
    clearTimeout(screenTimeout)
  screenTimeout = setTimeout(turnOff, timeout*1000)
  exec('xset -display :0.0 dpms force on')
}

function setScreenTimeout (t) {
  timeout = t
  turnOn()
}

module.exports = { turnOff, turnOn, setTimeout: setScreenTimeout }

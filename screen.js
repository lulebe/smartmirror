const exec = require('child_process').exec

let screenTimeout = null
let timeout = 300
let isOn = true

function turnOff () {
  if (isOn)
    exec('/opt/vc/bin/tvservice -o')
  isOn = false
}
function turnOn () {
  if (screenTimeout != null)
    clearTimeout(screenTimeout)
  screenTimeout = setTimeout(turnOff, timeout*1000)
  if (!isOn)
    exec('/opt/vc/bin/tvservice -p')
  isOn = true
}
function toggle () {
  if (isOn)
    turnOff()
  else
    turnOn()
}

function setScreenTimeout (t) {
  timeout = t
  turnOn()
}

module.exports = { turnOff, turnOn, toggle, setTimeout: setScreenTimeout }

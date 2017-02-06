const exec = require('child_process').exec

let screenTimeout = null
let hideWindow = null
let renderHomescreen = null
let timeout = 300
let isOn = true

function turnOff () {
  if (isOn) {
    exec('/opt/vc/bin/tvservice -o')
    if (hideWindow != null)
      hideWindow()
  }
  isOn = false
}
function turnOn () {
  if (screenTimeout != null)
    clearTimeout(screenTimeout)
  screenTimeout = setTimeout(turnOff, timeout*1000)
  if (!isOn) {
    exec('/opt/vc/bin/tvservice -p')
    if (renderHomescreen != null)
      renderHomescreen()
  }
  isOn = true
}
function toggle () {
  if (isOn)
    turnOff()
  else
    turnOn()
}

function init (t, hw, rh) {
  timeout = t
  hideWindow = hw
  renderHomescreen = rh
  turnOn()
}

module.exports = { turnOff, turnOn, toggle, init }

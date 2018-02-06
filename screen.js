const exec = require('child_process').exec
const path = require('path')

let screenTimeout = null
let hideWindow = null
let renderHomescreen = null
let timeout = 300
let isOn = true

function watchUltrasonic () {
  exec('python ' + path.join(__dirname, 'ultrasonic_once.py'), function (err, stdout, stderr) {
    if (stdout === "1")
      turnOn()
    setTimeout(watchUltrasonic, 500)
  })
}

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
  watchUltrasonic()
}

module.exports = { turnOff, turnOn, toggle, init }

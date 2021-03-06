let wpi
try {
  wpi = require('wiring-pi')
} catch (e) {
  wpi = {setup: () => {}, pinMode: () => {}, wiringPiISR: () => {}, wiringPiISRCancel: () => {}}
}

const screen = require('./screen')

const LONGPRESS_TIME = 1000

module.exports = function (buttonBar) {
  var enabled = true
  var btn0, btn1, btn2, btn3, btn4
  var longpressTimeouts = [null, null, null, null, null]
  const listeners = [
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null}
  ]


  const down = (btn) => {
    if (!enabled) return
    screen.turnOn()
    buttonBar.children('#btn'+btn).addClass('active')
    if (listeners[btn].down != null)
      listeners[btn].down()
    listeners[btn].lastDown = Date.now()
    longpressTimeouts[btn] = setTimeout(() => {
      buttonBar.children('#btn'+btn).addClass('long-active')
    }, LONGPRESS_TIME)
  }

  const up = (btn) => {
    if (!enabled) return
    if (longpressTimeouts[btn] != null)
      clearTimeout(longpressTimeouts[btn])
    buttonBar.children('#btn'+btn).removeClass('active long-active')
    const l = listeners[btn]
    if (l.up != null)
      l.up()
    if (Date.now() - l.lastDown > LONGPRESS_TIME) {
      if (l.longPress != null)
        l.longPress()
    } else {
      if (l.press != null)
        l.press()
    }
    l.lastDown = null
  }

  const initBtn = (gpio, btn) => {
    console.log("gpio -> btn", gpio, btn)
    var tout = null
    wpi.wiringPiISR(gpio, wpi.INT_EDGE_BOTH, function (delta) {
      clearTimeout(tout)
      tout = setTimeout(function () {
        if (wpi.digitalRead(gpio))
          up(btn)
        else
          down(btn)
      }, 30)
    })
  }

  const init = () => {
    wpi.setup('sys')
    initBtn(23, 0)
    initBtn(22, 1)
    initBtn(27, 2)
    initBtn(17, 3)
    initBtn(4, 4)
  }

  const close = () => {
    console.log('closing wpi')
    listeners.forEach(l => {
      l.down = null
      l.up = null
      l.press = null
      l.longpress = null
      l.lastDown = null
    })
    wpi.wiringPiISRCancel(7)
    wpi.wiringPiISRCancel(0)
    wpi.wiringPiISRCancel(2)
    wpi.wiringPiISRCancel(3)
    wpi.wiringPiISRCancel(4)
  }
  window.addEventListener('unload', () => {
    close()
  })

  const setListeners = (btn, onDown, onUp) => {
    listeners[btn].down = onDown
    listeners[btn].up = onUp
  }

  const setPressListener = (btn, onPress) => {
    listeners[btn].press = onPress
  }

  const setLongPressListener = (btn, onLongPress) => {
    listeners[btn].longPress = onLongPress
  }

  function initButtonBar () {
    buttonBar.children('#btn0').longpress(function () { // long press
      if (!enabled) return
      screen.turnOn()
      if (listeners[0].longPress != null)
        listeners[0].longPress()
    }, function () { // short press
      if (!enabled) return
      screen.turnOn()
      if (listeners[0].press != null)
        listeners[0].press()
    }, 1000)
    buttonBar.children('#btn1').longpress(function () { // long press
      if (!enabled) return
      screen.turnOn()
      if (listeners[1].longPress != null)
        listeners[1].longPress()
    }, function () { // short press
      if (!enabled) return
      screen.turnOn()
      if (listeners[1].press != null)
        listeners[1].press()
    }, 1000)
    buttonBar.children('#btn2').longpress(function () { // long press
      if (!enabled) return
      screen.turnOn()
      if (listeners[2].longPress != null)
        listeners[2].longPress()
    }, function () { // short press
      if (!enabled) return
      screen.turnOn()
      if (listeners[2].press != null)
        listeners[2].press()
    }, 1000)
    buttonBar.children('#btn3').longpress(function () { // long press
      if (!enabled) return
      screen.turnOn()
      if (listeners[3].longPress != null)
        listeners[3].longPress()
    }, function () { // short press
      if (!enabled) return
      screen.turnOn()
      if (listeners[3].press != null)
        listeners[3].press()
    }, 1000)
    buttonBar.children('#btn4').longpress(function () { // long press
      if (!enabled) return
      screen.turnOn()
      if (listeners[4].longPress != null)
        listeners[4].longPress()
    }, function () { // short press
      if (!enabled) return
      screen.turnOn()
      if (listeners[4].press != null)
        listeners[4].press()
    }, 1000)
  }

  const enable = e => {
    enabled = e
    if (e) return
    listeners.forEach(l => {
      l.lastDown = null
    })
    buttonBar.children('#btn0').removeClass('active')
    buttonBar.children('#btn1').removeClass('active')
    buttonBar.children('#btn2').removeClass('active')
    buttonBar.children('#btn3').removeClass('active')
    buttonBar.children('#btn4').removeClass('active')
  }


  initButtonBar()
  init()

  return {close, setListeners, setPressListener, setLongPressListener, enable}
}

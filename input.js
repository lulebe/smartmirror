//const wpi = require('wiring-pi')

const screen = require('./screen')

module.exports = function (buttonBar) {
  var btn0, btn1, btn2, btn3, btn4
  const listeners = [
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null},
    {down: null, up: null, press: null, longPress: null, lastDown: null}
  ]


  const down = (btn) => {
    screen.turnOn()
    buttonBar.children('#btn'+btn).addClass('active')
    if (listeners[btn].down != null)
      listeners[btn].down()
    listeners[btn].lastDown = Date.now()
  }

  const up = (btn) => {
    buttonBar.children('#btn'+btn).removeClass('active')
    const l = listeners[btn]
    if (l.up != null)
      l.up()
    if (l.lastDown - Date.now() > 1000) {
      if (l.longPress != null)
        l.longPress()
    } else {
      if (l.press != null)
        l.press()
    }
    l.lastDown = null
  }

  const init = () => {
    // wpi.setup('gpio')
    // wpi.pinMode(7, wpi.INPUT);
    // wpi.pinMode(7, wpi.INPUT);
    // wpi.pinMode(7, wpi.INPUT);
    // wpi.pinMode(7, wpi.INPUT);
    // wpi.pinMode(7, wpi.INPUT);
    // wpi.wiringPiISR(7, wpi.INT_EDGE_BOTH, function(delta) {
    //   console.log('Pin 7 changed to LOW (', delta, ')');
    // });
  }

  const close = () => {
    listeners.forEach(l => {
      l.down = null
      l.up = null
      l.press = null
      l.longpress = null
      l.lastDown = null
    })
  }

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
      if (listeners[0].longPress != null)
        listeners[0].longPress()
    }, function () { // short press
      if (listeners[0].press != null)
        listeners[0].press()
    }, 1000)
    buttonBar.children('#btn1').longpress(function () { // long press
      if (listeners[1].longPress != null)
        listeners[1].longPress()
    }, function () { // short press
      if (listeners[1].press != null)
        listeners[1].press()
    }, 1000)
    buttonBar.children('#btn2').longpress(function () { // long press
      if (listeners[2].longPress != null)
        listeners[2].longPress()
    }, function () { // short press
      if (listeners[2].press != null)
        listeners[2].press()
    }, 1000)
    buttonBar.children('#btn3').longpress(function () { // long press
      if (listeners[3].longPress != null)
        listeners[3].longPress()
    }, function () { // short press
      if (listeners[3].press != null)
        listeners[3].press()
    }, 1000)
    buttonBar.children('#btn4').longpress(function () { // long press
      if (listeners[4].longPress != null)
        listeners[4].longPress()
    }, function () { // short press
      if (listeners[4].press != null)
        listeners[4].press()
    }, 1000)
  }


  initButtonBar()

  return {close, setListeners, setPressListener, setLongPressListener}
}

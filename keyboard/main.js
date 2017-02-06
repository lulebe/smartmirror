const fs = require('fs')
const path = require('path')

const $ = require('jquery')

module.exports = function(domNode, actions, input, renderButtons) {

  var mEl = domNode
  var currentInput = ""
  var focused = {row: 0, key: 0}
  var uppercase = true
  var specialChars = false

  fs.readFile(path.join(__dirname, './markup.html'), {encoding: 'utf8'}, (err, content) => {
    if (err)
      throw err
    else {
      mEl.html(content)
      setFocus(0,0)
    }
  })

  function getElementByPosition(row, key) {
    var rows = mEl.find('.keyrow:nth-child('+(focused.row+1)+')')
    var keys = rows.children('.key.visible')
    return $(keys[key])
  }

  function getFocusedElement() {
    return getElementByPosition(focused.row, focused.key)
  }

  function setFocus(row, key) {
    getFocusedElement().removeClass('focus')
    focused = {row: row, key: key}
    getFocusedElement().addClass('focus')
  }

  function toggleCapitals() {
    if (uppercase)
      mEl.find('.keyboard').addClass('lowercase')
    else
      mEl.find('.keyboard').removeClass('lowercase')
    uppercase = !uppercase
  }

  function goLeft() {
    if (focused.key === 0)
      setFocus(focused.row, 10)
    else
      setFocus(focused.row, focused.key-1)
  }

  function goRight() {
    if (focused.key === 10)
      setFocus(focused.row, 0)
    else
      setFocus(focused.row, focused.key+1)
  }

  function goUp() {
    if (focused.row === 0)
      setFocus(3, focused.key)
    else
      setFocus(focused.row-1, focused.key)
  }

  function goDown() {
    if (focused.row === 3)
      setFocus(0, focused.key)
    else
      setFocus(focused.row+1, focused.key)
  }

  function click() {
    var el = getFocusedElement()
    el.addClass('pressed')
    setTimeout(function () {el.removeClass('pressed')}, 200)
    var clicked = el.text()
    if (el.hasClass('close'))
      actions.close()
    else if (clicked == '⬅') {
      if(currentInput.length >= 1)
        currentInput = currentInput.slice(0, -1);
    } else if (clicked == '↩')
      actions.submit(currentInput)
    else if (clicked == '⇧')
      toggleCapitals()
    else if (clicked == '?.,' || clicked == 'AB')
      toggleSpecialChars()
    else {
      if (!uppercase)
        currentInput += clicked.toLowerCase().substring(0,1)
      else
        currentInput += clicked.substring(0,1)
    }
    mEl.find('.input').text(currentInput)
  }

  function toggleSpecialChars() {
    var visibles = mEl.find('.keyrow > .key.visible')
    var invisibles = mEl.find('.keyrow > .key.invisible')
    visibles.removeClass('visible').addClass('invisible')
    invisibles.removeClass('invisible').addClass('visible')
    setFocus(focused.row, focused.key)
  }


  //manage Buttons
  input.setPressListener(0, click)
  input.setPressListener(1, goDown)
  input.setPressListener(2, goUp)
  input.setPressListener(3, goLeft)
  input.setPressListener(4, goRight)
  renderButtons({
    home: './res/btn-open.png',
    one: './res/btn-down.png',
    two: './res/btn-up.png',
    three: './res/btn-left.png',
    four: './res/btn-right.png'
  })
}

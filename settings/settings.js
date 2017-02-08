const exec = require('child_process').exec

module.exports = function (domNode, input, renderButtons, closeSettings) {

  var selected = 0

  domNode.html(`
    <div id="settings-overview">
      <img id="wifi" src="./res/wifi.png" class="selected" />
      <img id="reboot" src="./res/restart.png" />
    </div>
  `)

  const settingsOverview = domNode.find('#settings-overview')

  const close = function () {
    domNode.html('')
    closeSettings()
  }

  const reRender = () => {
    settingsOverview.children('.selected').removeClass('selected')
    settingsOverview.children('')[selected].classList.add('selected')
  }

  input.setPressListener(1, () => { //down
    if (selected == 1) return
    selected++
    reRender()
  })
  input.setPressListener(2, () => { //up
    if (selected == 0) return
    selected--
    reRender()
  })
  input.setPressListener(3, () => { //select
    switch (selected) {
      case 0:
        require('./wifi')(domNode, input, renderButtons, closeSettings)
        break;
      case 1:
        exec('reboot')
        break;
    }
  })
  input.setPressListener(4, null)
  renderButtons({one: './res/btn-down.png', two: './res/btn-up.png',
      three: './res/btn-open.png', four: './res/btn-none.png'})
}

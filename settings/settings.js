const exec = require('child_process').exec

module.exports = function (domNode, input, renderButtons, closeSettings) {

  var selected = 0

  domNode.html(`
    <div id="settings-overview">
      <img id="wifi" src="./res/wifi.png" class="selected" />
      <img id="reboot" src="./res/restart.png" />
      <img id="shutdown" src="./res/shutdown.png" />
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
    if (selected == 2) return
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
      case 2:
        exec('sudo shutdown -h 0')
    }
  })
  input.setPressListener(4, null)
  renderButtons({one: './res/btn-down.png', two: './res/btn-up.png',
      three: './res/btn-open.png', four: './res/btn-none.png'})
}

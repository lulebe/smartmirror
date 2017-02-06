module.exports = function (domNode, input, renderButtons, closeSettings) {

  const close = function () {
    domNode.html('')
    closeSettings()
  }

  domNode.html(`
    <div id="settings">
      <img id="wifi" />
      <img id="shutdown" />
      <ing id="close" />
    </div>
  `)


}

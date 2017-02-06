const WiFiControl = require('wifi-control')

WiFiControl.init({debug: true})

module.exports = function (domNode, input, renderButtons, closeSettings) {

  domNode.html('<h1>searching for Networks...</h1>')

  let selected = 0;
  let networks = [];

  const selectNetwork = function (index) {
    domNode.children('.network:nth-child(' + (selected+1) + ')').removeClass('active')
    selected = index
    const newNetworkEl = domNode.children('.network:nth-child(' + (selected+1) + ')')
    newNetworkEl.addClass('active')
    domNode.scrollTop(newNetworkEl.offset().top)
  }

  const connect = function (network, pw) {
    domNode.html('<h2>Connecting to ' + network.ssid + ' ...</h2>')
    WiFiControl.connectToAP({ssid: network.ssid, password: pw}, (err, res) => {
      if (err || !res.success) {
        console.log(err)
        return
      }
      domNode.html('<h2>Connected to ' + network.ssid + '</h2>')
      //TODO send some broadcast that wifi is available now
      setTimeout(closeSettings, 1500)
    })
  }

  const tapUp = function () {
    if (selected > 0)
      selectNetwork(selected-1)
  }

  const tapDown = function () {
    if (selected < networks.length-1)
      selectNetwork(selected+1)
  }

  const tapSelect = function () {
    domNode.html('<h1>Enter password</h1><div class="kb"></div>')
    const keyboardEl = domNode.children('.kb')
    const kbHandlers = require('../keyboard/main')(keyboardEl, {
      close: function () {
        closeSettings()
      },
      submit: function (pw) {
        connect(networks[selected], pw)
      }
    }, input, renderButtons)
  }

  const listContainsSSID = function (ssid) {
    return networks.some(network => network.ssid == ssid)
  }

  WiFiControl.scanForWiFi((err, res) => {
    if (err || !res.success) {
      domNode.html('<h2>An error occurred.</h2>')
      return
    }
    domNode.html('')
    networks = []
    for (var i = 0; i < res.networks.length; i++) {
      const network = res.networks[i]
      if (!listContainsSSID(network.ssid)) {
        networks.push(network)
        domNode.append('<div class="network">' + network.ssid + '</div>')
      }
    }
    selectNetwork(0)
    input.setPressListener(1, tapDown)
    input.setPressListener(2, tapUp)
    input.setPressListener(3, tapSelect)
  })
}

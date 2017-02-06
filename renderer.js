module.exports = (function () {
  const fs = require('fs')
  const path = require('path')

  const $ = require('jquery')

  const moduleLoader = require('./module_api/loader')
  const speech = require('./speech/recognition')
  const screen = require('./screen')


  const returns = {
    loadSettings, getSettings, setSettings,
    renderButtons, showVoiceOverlay
  }

  //DOM nodes
  const settingsBar = $('#settings')
  const statusBar = $('#status')
  const feed = $('#center')
  const itemWindow = $('#window')
  const voiceOverlay = $('#voice')
  const buttonBar = $('#btn-cues')

  //internal state
  const modules = []
  let settings = {
    name: "Spiegel",
    language: "DE",
    sleepTimer: 300,
    autoHideFeed: false,
    modules: [],
    googleSpeechId: null,
    googleSpeechKey: null,
    googleAPIKey: null
  }
  let settingsBarOpen = false
  let activeFeedItem = 0
  const clickableFeedItems = []


  //init input
  const input = require('./input')(buttonBar)
  input.setLongPressListener(0, toggleSettingsBar)



  function loadSettings (cb) {
    fs.readFile(path.join(__dirname, 'data/settings.json'), (err, content) => {
      if (err) {
        loadModules()
        cb(err)
        return
      }
      try {
        if (content.length > 10)
          settings = JSON.parse(content)
        else {
          setSettings(settings, () => {})
        }
      } catch (e) {
        loadModules()
        cb(e)
        return
      }
      speech.init(settings.googleSpeechId, settings.googleSpeechKey, voiceOverlay)
      loadModules()
      cb(null)
    })
  }

  function getSettings () {
    return Object.assign({}, settings)
  }

  function setSettings (newSettings, reloadModules, cb) {
    fs.writeFile(path.join(__dirname, 'data/settings.json'), JSON.stringify(newSettings, null, 2), err => {
      if (err)
        cb(err)
      else {
        cb(null)
        settings = newSettings
        speech.init(settings.googleSpeechId, settings.googleSpeechKey, voiceOverlay)
        screen.setTimeout(settings.sleepTimer)
        if (reloadModules)
          loadModules()
      }
    });
  }

  function loadModules () {
    moduleLoader(returns, modules, () => {
      renderHomescreen()
    })
  }


  function renderButtons (btnImgs) {
    const path0 = path.join(__dirname, btnImgs.home || './res/btn-home.png')
    const path1 = path.join(__dirname, btnImgs.one || './res/btn-down.png')
    const path2 = path.join(__dirname, btnImgs.two || './res/btn-up.png')
    const path3 = path.join(__dirname, btnImgs.three || './res/btn-open.png')
    const path4 = path.join(__dirname, btnImgs.four || './res/btn-hide.png')
    buttonBar.children('#btn0').attr('src', path0)
    buttonBar.children('#btn1').attr('src', path1)
    buttonBar.children('#btn2').attr('src', path2)
    buttonBar.children('#btn3').attr('src', path3)
    buttonBar.children('#btn4').attr('src', path4)
  }

  function toggleSettingsBar () {
    if (settingsBarOpen) {
      settingsBarOpen = false
      settingsBar.removeClass('shown')
      renderHomescreen()
    } else {
      settingsBarOpen = true
      settingsBar.addClass('shown')
      require('./settings/settings.js')(
        settingsBar,
        input,
        renderButtons,
        toggleSettingsBar
      )
    }
  }

  function renderHomescreen () {
    statusBar.html('')
    feed.html('')
    itemWindow.html('')
    itemWindow.removeClass('shown')
    voiceOverlay.removeClass('shown')
    feed.scrollTop(0)
    if (settings.autoHideFeed)
      feed.addClass('hidden')
    else
      feed.removeClass('hidden')
    renderButtons({})
    input.setPressListener(0, renderHomescreen)
    input.setPressListener(1, function () {
      if (activeFeedItem >= feed.children().length-1) return
      feed.children()[activeFeedItem].classList.remove('active')
      activeFeedItem++
      feed.children()[activeFeedItem].classList.add('active')
      feed.animate({
        scrollTop: $(feed.children()[activeFeedItem]).offset().top - feed.offset().top + feed.scrollTop() - 24
      }, 150)
    })
    input.setPressListener(2, function () {
      if (activeFeedItem === 0) return
      feed.children()[activeFeedItem].classList.remove('active')
      activeFeedItem--
      feed.children()[activeFeedItem].classList.add('active')
      feed.animate({
        scrollTop: $(feed.children()[activeFeedItem]).offset().top - feed.offset().top + feed.scrollTop() - 24
      }, 150)
    })
    input.setPressListener(3, function () {
      if (clickableFeedItems[activeFeedItem].canClick) {
        input.setPressListener(1, null)
        input.setPressListener(2, null)
        input.setPressListener(3, null)
        input.setPressListener(4, null)
        renderButtons({one: './res/btn-none.png', two: './res/btn-none.png',
            three: './res/btn-none.png', four: './res/btn-none.png'})
        clickableFeedItems[activeFeedItem].fillWindow(openWindow(), input, renderButtons)
      }
    })
    input.setPressListener(4, function () {
      feed.toggleClass('hidden')
    })
    modules.forEach(mdl => {
      if (mdl.settings.providesStatus) {
        const domEl = $('<section style="float: ' + mdl.settings.status.position + ';"></section>')
        domEl.appendTo(statusBar)
        mdl.module.renderStatus(domEl)
      }
      if (mdl.settings.providesFeed) {
        //TODO feed implementation
        mdl.module.renderFeed(function (clickData) {
          const isFirst = feed.children().length === 0
          if (isFirst)
            activeFeedItem = 0
          const html = isFirst ? '<section class="active"></section>' : '<section></section>'
          const domEl = $(html)
          clickableFeedItems[feed.children().length] = clickData
          domEl.appendTo(feed)
          return domEl
        })
      }
    })
  }
  speech.addCommands({
    'zurück': renderHomescreen,
    '(go) back': renderHomescreen
  })

  function openWindow () {
    itemWindow.html('')
    itemWindow.addClass('shown')
    return itemWindow
  }

  function showVoiceOverlay (open) {
    if (open)
      voiceOverlay.addClass('shown')
    else
      voiceOverlay.removeClass('shown')
  }

  return returns

})()

const speak = require('watson-speech/text-to-speech/synthesize')
const watson = require('watson-developer-cloud')

var token = null
let authorization = null

module.exports = {
  speak: function (text, language, cb) {
    if (token == null) {
      cb()
      return
    }
    speak({text: text, token: token, voice: language == 'DE' ? 'de-DE_DieterVoice' : 'en-US_MichaelVoice'}).addEventListener('ended', function () {
      cb()
    })
  },
  init: function (c) {
    authorization = new watson.AuthorizationV1({
      username: c.username,
      password: c.password,
      url: watson.TextToSpeechV1.URL
    });
    renewToken(t)
    setInterval(() => {renewToken(t)}, 3000000)
  }
}
function renewToken (c) {
  authorization.getToken((err, t) => {
    if (err) {
      token = null
      setTimeout(() => {renewToken(c)}, 5000)
    } else {
      token = t
    }
  })
}

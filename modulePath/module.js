const $ = require('jquery')

module.exports = (function () {
  return {
    renderStatus: function (domNode) {
      const clock = $('<span class="smm-clock-time"></span>')
      const hour = $('<span></span>')
      const minute = $('<span></span>')
      clock.append(hour)
      clock.append('<span class="smm-clock-blink">:</span>')
      clock.append(minute)
      const date = $('<span class="smm-clock-date"></span>')

      const container = $('<div class="smm-clock-container"></div>')
      container.append(clock)
      container.append('<br>')
      container.append(date)
      container.appendTo(domNode)

      const update = () => {
        var curDate = new Date()
        hour.text(curDate.getHours())
        minute.text(curDate.getMinutes())
        date.text(curDate.getDate() + '.' + (curDate.getMonth()+1) + '.' + curDate.getFullYear())
      }
      update();

      const timer = setInterval(update, 60000)
    }
  }
})()

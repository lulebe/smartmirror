const router = require('express').Router()

const screen = require('../screen')

module.exports = router


router.get('/screenon', (req, res) => {
  screen.turnOn()
  res.status(200).send()
})
router.get('/screenoff', (req, res) => {
  screen.turnOff()
  res.status(200).send()
})
router.get('/screentoggle', (req, res) => {
  screen.toggle()
  res.status(200).send()
})

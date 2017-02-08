const router = require('express').Router()
const exec = require('child_process').exec
const path = require('path');

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
router.get('/reboot', (req, res) => {
  res.status(200).send()
  setTimeout(() => {exec('reboot')}, 700)
})
router.get('/update', () => {
  res.status(200).send()
  exec('sh ' + path.join(__dirname, '../update.sh'))
})

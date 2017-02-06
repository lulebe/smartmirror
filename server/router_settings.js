const fs = require('fs')
const path = require('path')
const router = require('express').Router()

module.exports = router

const SETTINGS_PATH = path.join(__dirname, '../data/settings.json')


router.get('/', (req, res) => {
  const settings = require('../renderer').getSettings()
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(settings, null, 2))
})

router.post('/', (req, res) => {
  require('../renderer').setSettings(req.body, true, err => {
    if (err)
      res.status(500).send()
    else
      res.status(200).send(req.body)
  })
})

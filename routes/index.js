const express = require('express')
const {getStats, getStatus} = require('../controllers/AppController')
const route = express.Router()

route.get('/status', getStatus)
route.get('/stat', getStats)

module.exports = route
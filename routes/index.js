const express = require('express')
const {getStats, getStatus} = require('../controllers/AppController')
const {postNew} = require('../controllers/UsersController')
const route = express.Router()

route.get('/status', getStatus)
route.get('/stat', getStats)
route.post('/users', postNew)

module.exports = route
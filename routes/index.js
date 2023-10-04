const express = require('express')
const {getStats, getStatus} = require('../controllers/AppController')
const {postNew, getMe} = require('../controllers/UsersController')
const {getConnect, getDisconnect} = require('../controllers/AuthController')
const { authenticate, xTokenAuth } = require('../middleware/auth')
const route = express.Router()

route.get('/status', getStatus)
route.get('/stat', getStats)
route.post('/users', postNew)
route.get('/connect', authenticate, getConnect)
route.get('/disconnect', xTokenAuth, getDisconnect)
route.get('/users/me', xTokenAuth, getMe)
route.post('/files')

module.exports = route
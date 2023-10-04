const express = require('express')
const {getStats, getStatus} = require('../controllers/AppController')
const {postNew} = require('../controllers/UsersController')
const {getConnect} = require('../controllers/AuthController')
const { authenticate } = require('../middleware/auth')
const route = express.Router()

route.get('/status', getStatus)
route.get('/stat', getStats)
route.post('/users', postNew)
route.get('/connect', authenticate, getConnect)
route.get('/disconnect', getConnect)
route.get('/users/me')

module.exports = route
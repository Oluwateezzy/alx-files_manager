const express = require('express');
const { getStats, getStatus } = require('../controllers/AppController');
const { postNew, getMe } = require('../controllers/UsersController');
const { getConnect, getDisconnect } = require('../controllers/AuthController');
const {
  postUpload, getIndex, getShow, putUnpublish, putPublish, getFile,
} = require('../controllers/FilesController');
const { authenticate, xTokenAuth } = require('../middleware/auth');

const route = express.Router();

route.get('/status', getStatus);
route.get('/stat', getStats);
route.post('/users', postNew);
route.get('/connect', authenticate, getConnect);
route.get('/disconnect', xTokenAuth, getDisconnect);
route.get('/users/me', xTokenAuth, getMe);
route.post('/files', xTokenAuth, postUpload);
route.get('/files/:id', xTokenAuth, getShow);
route.get('/files', xTokenAuth, getIndex);
route.put('/files/:id/publish', xTokenAuth, putPublish);
route.put('/files/:id/unpublish', xTokenAuth, putUnpublish);
route.get('/files/:id/data', xTokenAuth, getFile);

module.exports = route;

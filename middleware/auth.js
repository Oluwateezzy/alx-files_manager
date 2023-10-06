import mongoDBCore from 'mongodb/lib/core';
import redisClient from '../utils/redis';

const sha1 = require('sha1');
const dbClient = require('../utils/db');

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const authToken = authHeader.split(' ')[1];
  if (!authToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = Buffer.from(authToken, 'base64').toString();
  console.log(token);
  const sep = token.indexOf(':');
  const email = token.substring(0, sep);
  const password = token.substring(sep + 1);
  const user = await (await dbClient.usersCollection()).findOne({ email });
  if (!user || sha1(password) !== user.password) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  console.log(user);
  next();
}

export async function xTokenAuth(req, res, next) {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await (await dbClient.usersCollection())
    .findOne({ _id: new mongoDBCore.BSON.ObjectId(userId) });
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
}

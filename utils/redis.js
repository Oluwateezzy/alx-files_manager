const redis = require('redis');

class RegisClient {
  constructor() {
    const client = redis.createClient();
    client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`);
    });
  }

  isAlive() {

  }
}
module.exports = RegisClient;

const redis = require('redis');
const {promisify} = require('util')

class RegisClient {
  constructor() {
    this.client = redis.createClient();
    this.isConnected = true
    this.client.on('error', (err) => {
      console.error(`Redis client not connected to the server: ${err.message}`)
      this.isConnected = false
    });
    this.client.on('connect', () => {
        this.isConnected = true
    })
    this.getAsyn = promisify(this.client.get).bind(this.client)
    this.delAsyn = promisify(this.client.del).bind(this.client)
    this.setAsyn = promisify(this.client.setex).bind(this.client)

  }
  isAlive(){
    return this.isConnected
  }

  async get(key){
    return this.getAsyn(key)
  }

  async set(key, value, time){
    return this.setAsyn(key, time, value)
  }

  async del(key) {
    return this.delAsyn(key)
  }
}

const redisClient = new RegisClient()
module.exports = redisClient
const redisClient = require('./utils/redis');

(async () => {
  console.log(redisClient.isAlive());
  console.log(await redisClient.get('m'));
  await redisClient.set('m', 12, 5);
  console.log(await redisClient.get('m'));

  setTimeout(async () => {
    console.log(await redisClient.get('m'));
  }, 1000 * 10);
})();

const redisClient = require('./utils/redis');

(async () => {
    console.log(redisClient.isAlive());
    console.log(await redisClient.get('my'));
    await redisClient.set('my', 12, 5);
    console.log(await redisClient.get('my'));

    setTimeout(async () => {
        console.log(await redisClient.get('my'));
    }, 1000*10)
})();
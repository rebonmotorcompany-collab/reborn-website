import redis from 'redis';
import config from './index';

const redisClient = redis.createClient({
  url: config.redisUrl,
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error', err);
});

export default redisClient;

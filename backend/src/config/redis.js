// backend/src/config/redis.js
import { createClient } from 'redis';
import dotenv from "dotenv";

const initRedisClient = async () => {
  console.log('Initializing Redis client...');

  const redisClient = createClient({
    url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  try {
    await redisClient.connect();
    console.log('Redis client connected successfully ', process.env.REDIS_PORT);
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }

  return redisClient;
};

export default initRedisClient;

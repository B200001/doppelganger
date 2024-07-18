// backend/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './src/config/db.js';
import initRedisClient from './src/config/redis.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();



// Initialize Redis client
initRedisClient().then(redisClient => {
  app.locals.redisClient = redisClient;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  console.log('MONGODB_URI:', process.env.MONGODB_URI);


  redisClient.on('connect', () => {
    console.log('Redis client connected on port', process.env.REDIS_PORT);
  });
}).catch(err => {
  console.error('Error initializing Redis client:', err);
});

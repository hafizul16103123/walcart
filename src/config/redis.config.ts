import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('connect',()=>{
  // console.log('redis connected')
})
redisClient.on('error', (err) => console.log('Redis Client Error', err));
export default redisClient
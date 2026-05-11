import { Redis } from "ioredis";
import { env } from "./env.js";

const redis = new Redis({
    host: env.redisHost,
    port: Number(env.redisPort ?? 6379),
    password: env.redisPassword,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
});

redis.on('error', (err) => { console.error('Redis error:', err); });

redis.on('connect', () => { console.log('Connected to Redis'); });

export default redis;
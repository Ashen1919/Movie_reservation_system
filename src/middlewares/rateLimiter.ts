import RedisStore, { type RedisReply } from "rate-limit-redis";
import redis from "../config/redis.js";
import rateLimit from "express-rate-limit";

// create a new RedisStore
const makeStore = (prefix: string) => {
    return new RedisStore({
        sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as Promise<RedisReply>,
        prefix,
    });
};

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    store: makeStore("rl:global"),
    message: {success: false, message: "Too many requests, please try again later."},
});

// Strict limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:auth:'),
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

// Seat locking — prevent abuse of the lock window
export const lockLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:lock:'),
  message: { success: false, message: 'Too many lock attempts.' },
});
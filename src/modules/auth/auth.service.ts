import prisma from "../../config/db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../config/jwt.js";
import redis from "../../config/redis.js";

// redis TTL define
const REFRESH_TTL = 7 * 24 * 60 * 60; 

// Token hash helper function
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

// signup service
export const signup = async (name: string, email: string, password: string) => {
    // check email is already exist
    const existing = await prisma.user.findUnique({where: { email }});
    if (existing) throw new Error('Email already in use');

    // password hashing
    const passwordHash = await bcrypt.hash(password, 10);

    // signup a user
    const user = await prisma.user.create({data: { name, email, passwordHash }});

    return {id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.isEmailVerified}
};

// login service
export const login = async (email: string, password: string) => {
    // check user is exist
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) throw new Error('Invalid credentials');

    // check password is correct
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    // token generating
    const payload = {userId: user.id, role: user.role, jti: crypto.randomUUID()};
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // store hashed refresh token in Redis
    const key = `refresh:${user.id}:${hashToken(refreshToken)}`;
    await redis.set(key, user.role, 'EX', REFRESH_TTL);

    return {accessToken, refreshToken};
};

// refresh token rotation
export const refresh = async (token: string) => {
    // retrieve payload from refresh token
    const payload = verifyRefreshToken(token) as {userId: string, role: string};
    
    // check token exist in redis
    const key = `refresh:${payload.userId}:${hashToken(token)}`;
    const exist = await redis.get(key);
    if (!exist) {
        // logout from all devices if token is reused
        await logoutAll(payload.userId);
        throw new Error('Refresh token reuse detected');
    };

    // delete old refresh token from redis
    await redis.del(key);

    // generate new access & refresh tokens
    const newPayload = {userId: payload.userId, role: payload.role, jti: crypto.randomUUID()};
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    // store new hashed refresh token in redis
    const newKey = `refresh:${newPayload.userId}:${hashToken(refreshToken)}`;
    await redis.set(newKey, newPayload.role, 'EX', REFRESH_TTL);

    return {accessToken, refreshToken};
};

// logout service
export const logout = async (userId: string, token: string) => {
    const key = `refresh:${userId}:${hashToken(token)}`;
    await redis.del(key);
};

// Logout from all devices
export const logoutAll = async (userId: string) => {
    const keys = await redis.keys(`refresh:${userId}:*`);
    if (keys.length) await redis.del(...keys);
};
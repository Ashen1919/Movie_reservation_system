import Jwt from "jsonwebtoken"
import { env } from "./env.js"

// access token creation
export const signAccessToken = (payload: object) => 
    Jwt.sign(payload, env.jwtAccessSecret, {
        expiresIn: env.jwtAccessExpiresIn as any
    })

// refresh token creation
export const signRefreshToken = (paylod: object) =>
    Jwt.sign(paylod, env.jwtRefreshSecret, {
        expiresIn: env.jwtRefreshExpiresIn as any
    })

// verify access token
export const verifyAccessToken = (token: string) =>
    Jwt.verify(token, env.jwtAccessSecret);

// verify refresh token
export const verifyRefreshToken = (token: string) =>
    Jwt.verify(token, env.jwtRefreshSecret);
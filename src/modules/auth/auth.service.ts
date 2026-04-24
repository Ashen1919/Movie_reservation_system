import prisma from "../../config/db.js";
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../config/jwt.js";

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
    const payload = {userId: user.id, role: user.role};
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // store hashed refresh token
    const hashed = await bcrypt.hash(refreshToken, 10);
    const update = await prisma.user.update({where: {id: user.id}, data: {refreshToken: hashed} });
    if (!update) throw new Error('Fail to update token');

    return {accessToken, refreshToken};
};

// refresh token rotation
export const refresh = async (token: string) => {
    // retrieve payload from refresh token
    const payload = verifyRefreshToken(token) as {userId: string, role: string};
    
    // check user is exist
    const user = await prisma.user.findUnique({where: {id: payload.userId}});
    if(!user || !user.refreshToken) throw new Error('Invalid refresh token');

    // check refresh token validation
    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) throw new Error('Invalid refresh token');

    // generate new access & refresh tokens
    const newPayload = {userId: user.id, role: user.role};
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    // store hashed refresh token
    const hashed = await bcrypt.hash(refreshToken, 10);
    const update = await prisma.user.update({where: {id: user.id}, data: {refreshToken: hashed}});
    if(!update) throw new Error('Fail to update token');

    return {accessToken, refreshToken};
};

// logout service
export const logout = async (userId: string) => {
    const result = await prisma.user.update({where: {id: userId}, data: {refreshToken: null}});
    if(!result) throw new Error('Fail to logout');
}
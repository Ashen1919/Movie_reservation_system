import prisma from "../../config/db.js";
import { verifyRefreshToken } from "../../config/jwt.js"

// get my profile service
export const myProfile = async (token: string) => {
    // get user ID from token
    const payload = verifyRefreshToken(token) as { userId: string, role: string };

    // check user is exist
    const user = await prisma.user.findUnique({ where: {id: payload.userId} });
    if(!user || !user.refreshToken) throw new Error('User does not exist!');

    return user;
}
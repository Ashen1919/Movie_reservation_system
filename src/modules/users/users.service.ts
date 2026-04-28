import prisma from "../../config/db.js";
import { verifyRefreshToken } from "../../config/jwt.js"

// get my profile service
export const myProfile = async (userId: string) => {
    // check user is exist
    const user = await prisma.user.findUnique({ 
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true,
            isEmailVerified: true
        } 
    });
    if(!user) throw new Error('User does not exist!');

    return user;
}
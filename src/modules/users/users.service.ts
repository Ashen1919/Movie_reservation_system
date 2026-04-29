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
            isEmailVerified: true,
            isBlocked: true
        } 
    });
    if(!user) throw new Error('User does not exist!');

    return user;
}

// get all users list service
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                role: true,
                isEmailVerified: true,
                isBlocked: true
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' } 
        }),
        prisma.user.count()
    ]);

    if (users.length === 0) throw new Error('No any user found!');

    return {
        data: users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    }
};

// Block a user
export const blockUser = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (user.role === 'ADMIN') throw new Error('Cannot block an admin');

    return prisma.user.update({
        where: { id: userId },
        data: { isBlocked: true }
    });
};

// Unblock a user
export const unblockUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isBlocked: false }
  });
};


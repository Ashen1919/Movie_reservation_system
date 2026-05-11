import prisma from "../../config/db.js"
import redis from "../../config/redis.js";

// define TTL for cache in seconds
const GENRE_LIST_TTL = 60;

// define cache keys
const CACHE_KEYS = {getAllGenre: (page: number, limit: number) => `genres:page:${page}:limit:${limit}`};

// Helper function to invalidate cache for genres
const invalidateGenreCache = async () => {
    // invalidate cache for genre list
    const listKeys = await redis.keys(`genres:page:*`);
    if (listKeys.length) {
        await redis.del(...listKeys);
    }
};

// create a genre service
export const createGenre = async (name: string) => {
    const existing = await prisma.genre.findUnique({where: { name }});
    if (existing) throw new Error('The genre name is already exist!');

    const genre = await prisma.genre.create({data: { name }});

    await invalidateGenreCache();
    return {name: genre.name};
};

// get all genres
export const getAllGenre = async (page: number = 1, limit: number = 10) => {
    // check cache first
    const cacheKey = CACHE_KEYS.getAllGenre(page, limit);
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // calculate skip for pagination
    const skip = (page - 1) * limit;

    // fetch genres and total count in a transaction
    const [genres, total] = await prisma.$transaction([
        prisma.genre.findMany({
            select: {id: true, name: true},
            skip,
            take: limit,
            orderBy: { name: 'asc' }
        }),
        prisma.genre.count()
    ]);
    
    // if no genre found, throw error
    if (genres.length === 0) throw new Error('Fail to find any Genre!');

    const result = {
        data: genres,
        meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };

    // cache the result
    await redis.set(cacheKey, JSON.stringify(result), 'EX', GENRE_LIST_TTL);
    return result;

};
import prisma from "../../config/db.js"

// create a genre service
export const createGenre = async (name: string) => {
    const existing = await prisma.genre.findUnique({where: { name }});
    if (existing) throw new Error('The genre name is already exist!');

    const genre = await prisma.genre.create({data: { name }});

    return {name: genre.name};
};

// get all genres
export const getAllGenre = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [genres, total] = await prisma.$transaction([
        prisma.genre.findMany({
            select: {id: true, name: true},
            skip,
            take: limit,
            orderBy: { name: 'asc' }
        }),
        prisma.genre.count()
    ]);
    
    if (genres.length === 0) throw new Error('Fail to find any Genre!');

    return {
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

};
import prisma from "../../config/db.js"

// create a genre service
export const createGenre = async (name: string) => {
    const existing = await prisma.genre.findUnique({where: { name }});
    if (existing) throw new Error('The genre name is already exist!');

    const genre = await prisma.genre.create({data: { name }});

    return {name: genre.name};
};

// get all genres
export const getAllGenre = async () => {
    const genres = await prisma.genre.findMany({
        select: {
            id: true,
            name: true
        }
    });
    if (!genres) throw new Error('Fail to find any Genre!');

    return genres;

};
import type { Prisma } from "@prisma/client";
import prisma from "../../config/db.js";
import redis from "../../config/redis.js";

// define TTL for cache in seconds
const MOVIE_TTL = 300;
const MOVIE_LIST_TTL = 60;

// define cache keys
const CACHE_KEYS = {
    movieById: (id: string) => `movie:${id}`,
    allMovies: (page: number, limit: number) => `movies:page:${page}:limit:${limit}`,
};

// Helper function to invalidate cache for movies
const invalidateMovieCache = async (movieId?: string) => {
    // invalidate cache for movie list
    const listKeys = await redis.keys(`movies:page:*`);
    if (listKeys.length) {
        await redis.del(...listKeys);
    };

    // invalidate cache for specific movie if movieId is provided
    if (movieId) await redis.del(`movie:${movieId}`);
};

// Create a new movie
export const createMovie = async (data: {
    title: string, 
    description: string, 
    durationMinutes: number,
    genreIds: string[],
}) => {
    // checks genreId is already exist
    const genreExist = await prisma.genre.findMany({
        where: {
            id: { in: data.genreIds }
        }
    });
    if (genreExist.length !== data.genreIds.length) {
        throw new Error('One or more genreIds do not exist');
    }

    // check movie with the same title already exists
    const existingMovie = await prisma.movie.findUnique({
        where: { title: data.title }
    });

    if (existingMovie) {
        throw new Error('Movie with the same title already exists');
    }

    // create new movie
    const newMovie = await prisma.movie.create({ data: {
        title: data.title,
        description: data.description,
        durationMinutes: data.durationMinutes,
        genres: { create: data.genreIds.map(genreId => ({ genreId })) }
    },
    include: {
        genres: {
            include: { genre: true }
        }
    } });

    await invalidateMovieCache();
    return newMovie;
};

// Upload poster for a movie
export const uploadPoster = async (movieId: string, posterUrl: string) => {
    // check if movie exists
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
        throw new Error('Movie not found');
    }

    // update posterUrl for the movie
    const updatedMovie = await prisma.movie.update({
        where: { id: movieId },
        data: { posterUrl }
    });

    await invalidateMovieCache(movieId);
    return updatedMovie;
};

// Get all movies with pagination
export const getAllMovies = async (page: number, limit: number) => {
    // check cache first
    const cacheKey = CACHE_KEYS.allMovies(page, limit);
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // calculate skip for pagination
    const skip = (page - 1) * limit;

    // fetch movies and total count in a transaction
    const [movies, total] = await prisma.$transaction([
        prisma.movie.findMany({
            include: {
                genres: {
                    include: { genre: true }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.movie.count()
    ]);
    const result = { 
        data: movies,
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
    await redis.set(cacheKey, JSON.stringify(result), 'EX', MOVIE_LIST_TTL);
    return result;
};

// Get movie details by ID
export const getMovieById = async (movieId: string) => {
    // check cache first
    const cacheKey = CACHE_KEYS.movieById(movieId);
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
        include: {
            genres: {
                include: { genre: true }
            }
        }
    });

    if (!movie) {
        throw new Error('Movie not found');
    }

    // cache the result
    await redis.set(cacheKey, JSON.stringify(movie), 'EX', MOVIE_TTL);
    return movie;
};

// Update movie details
export const updateMovie = async (movieId: string, data: { title?: string, description?: string, durationMinutes?: number, genreIds?: string[] }) => {
    // check if movie exists
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
        throw new Error('Movie not found');
    }

    // build update data object
    const updateData: Prisma.MovieUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;
    if (data.genreIds !== undefined) {
        const genreExist = await prisma.genre.findMany({
            where: { id: { in: data.genreIds } }
        });
        if (genreExist.length !== data.genreIds.length) {
            throw new Error('One or more genreIds do not exist');
        }

        const currentGenres = await prisma.movieGenre.findMany({
            where: { movieId }
        });
        const currentGenreIds = currentGenres.map(mg => mg.genreId);

        const genresToAdd = data.genreIds.filter(id => !currentGenreIds.includes(id));
        const genresToRemove = currentGenreIds.filter(id => !data.genreIds!.includes(id));

        updateData.genres = {
            deleteMany: { genreId: { in: genresToRemove } },
            create: genresToAdd.map(genreId => ({ genreId }))
        };
    }

    // update movie details
    const updatedMovie = await prisma.movie.update({
        where: { id: movieId },
        data: updateData,
        include: {
            genres: { include: { genre: true } } 
        }
    });

    await invalidateMovieCache(movieId);
    return updatedMovie;
};

// Delete a movie
export const deleteMovie = async (movieId: string) => {
    // check if movie exists
    const existingMovie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!existingMovie) {
        throw new Error('Movie not found');
    }
    // delete the movie
    await prisma.movie.delete({ where: { id: movieId } });
    await invalidateMovieCache(movieId);
};
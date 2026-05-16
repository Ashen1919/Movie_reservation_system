import type { Request, Response } from 'express';
import * as MovieService from './movie.service.js';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
import { createMovieSchema, movieIdParamSchema, movieQuerySchema, updateMovieSchema } from './movie.schema.js';

// Create a new movie
export const createMovie = async (req: Request, res: Response) => {
    try {
        const { title, description, durationMinutes, genreIds } = createMovieSchema.parse(req.body);
        const newMovie = await MovieService.createMovie({ title, description, durationMinutes, genreIds });
        res.status(201).json({
            success: true, 
            data: newMovie 
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Upload poster for a movie
export const uploadPoster = async (req: Request, res: Response) => {
    try {
        const { id } = movieIdParamSchema.parse(req.params);
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Poster file is required' });
        }
        const posterUrl = await uploadToCloudinary(req.file.buffer, 'movie-posters');
        const updatedMovie = await MovieService.uploadPoster(movieId, posterUrl);
        res.status(200).json({
            success: true,
            data: updatedMovie
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Get all movies with pagination
export const getAllMovies = async (req: Request, res: Response) => {
    try {
        const { page, limit } = movieQuerySchema.parse(req.query);

        const movies = await MovieService.getAllMovies(page, limit);
        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Get a movie by ID
export const getMovieById = async (req: Request, res: Response) => {
    try {
        const { id } = movieIdParamSchema.parse(req.params);
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }

        const movie = await MovieService.getMovieById(movieId);
        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Update a movie
export const updateMovie = async (req: Request, res: Response) => {
    try {
        const { id } = movieIdParamSchema.parse(req.params);
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }

        const body = updateMovieSchema.parse(req.body);

        const updateData: {
            title?: string;
            description?: string;
            durationMinutes?: number;
            genreIds?: string[];
        } = {};

        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.durationMinutes !== undefined) updateData.durationMinutes = body.durationMinutes;
        if (body.genreIds !== undefined) updateData.genreIds = body.genreIds;

        const updatedMovie = await MovieService.updateMovie(movieId, updateData);
        res.status(200).json({
            success: true,
            data: updatedMovie
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

// Delete a movie
export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { id } = movieIdParamSchema.parse(req.params);
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }

        await MovieService.deleteMovie(movieId);
        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (err: any) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};
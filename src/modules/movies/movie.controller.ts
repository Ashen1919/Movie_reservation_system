import type { Request, Response } from 'express';
import * as MovieService from './movie.service.js';

// Create a new movie
export const createMovie = async (req: Request, res: Response) => {
    try {
        const { title, description, durationMinutes, genreIds } = req.body;
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
        const { id } = req.params;
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Poster file is required' });
        }
        const posterUrl = (req.file as Express.Multer.File & { path: string }).path;
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

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
        const { id } = req.params;
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
        const { id } = req.params;
        const movieId = Array.isArray(id) ? id[0] : id;

        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }

        const { title, description, durationMinutes, genreIds } = req.body;
        const updatedMovie = await MovieService.updateMovie(movieId, { title, description, durationMinutes, genreIds });
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
        const { id } = req.params;
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
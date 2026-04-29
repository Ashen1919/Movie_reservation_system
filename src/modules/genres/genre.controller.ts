import type { Request, Response } from "express";
import * as GenreService from './genre.service.js';

// create a genre
export const createGenre = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const genre = await GenreService.createGenre(name);

        res.status(201).json({
            success: true,
            data: { genre }
        });
    } catch(err: any) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// Get all genres
export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await GenreService.getAllGenre(page, limit);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
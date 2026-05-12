import z from "zod/v3";

export const createGenreSchema = z.object({
    name: z.string().min(1, 'Name must be at least 1 character long').max(100, 'Name must be at most 100 characters long')
});

export const genreQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
});
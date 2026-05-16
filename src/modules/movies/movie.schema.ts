import z from "zod/v3";

export const createMovieSchema = z.object({
    title: z.string().min(1, 'Title must be at least 1 character long').max(255, 'Title must be at most 255 characters long'),
    description: z.string().min(1, 'Description must be at least 1 character long'),
    durationMinutes: z.number().int().positive(),
    genreIds: z.array(z.string().uuid()).min(1, 'At least one genre must be selected'),
});

export const updateMovieSchema = createMovieSchema.partial();

export const movieQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().max(100).default(20),
});

export const movieIdParamSchema = z.object({
    id: z.string().uuid({message: 'Invalid movie ID format'}),
});

export type CreateMovieDTO = z.infer<typeof createMovieSchema>;
export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;
export type MovieQueryDTO = z.infer<typeof movieQuerySchema>;
export type MovieIdParamDTO = z.infer<typeof movieIdParamSchema>;
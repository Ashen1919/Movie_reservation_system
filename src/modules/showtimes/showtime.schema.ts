import z from "zod/v3";

export const createShowtimeSchema = z.object({
    movieId: z.string().uuid(),
    startTime: z.string().datetime(),
    price: z.number().positive(),
    hallName: z.string().min(1, 'At least 1 character required for hall name').max(100, 'At most 100 characters allowed for hall name'),
    rows: z.array(z.string().min(1, 'At least 1 character required for row name').max(5, 'At most 5 characters allowed for row name')).optional(),
    seatsPerRow: z.number().int().positive().max(50, 'At most 50 seats per row allowed').optional()
});

export const updateShowtimeSchema = createShowtimeSchema.partial();

export const showtimeIdParamSchema = z.object({
    id: z.string().uuid({message: 'Invalid showtime ID format'}),
});

export type CreateShowtimeDTO = z.infer<typeof createShowtimeSchema>;
export type UpdateShowtimeDTO = z.infer<typeof updateShowtimeSchema>;
export type ShowtimeIdParam = z.infer<typeof showtimeIdParamSchema>;
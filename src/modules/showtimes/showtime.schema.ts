import z from "zod/v3";

export const createShowtimeSchema = z.object({
    movie_id: z.string().uuid(),
    start_time: z.string().datetime(),
    price: z.number().positive(),
    hall_name: z.string().min(1, 'At least 1 character required for hall name').max(100, 'At most 100 characters allowed for hall name'),
    total_seats: z.number().int().positive().max(500),
});

export const updateShowtimeSchema = createShowtimeSchema.partial();
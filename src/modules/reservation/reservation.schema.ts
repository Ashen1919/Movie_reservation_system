import z from "zod";

export const loackSeatsSchema = z.object({
    showtimeId: z.string().uuid({ message: "Invalid showtime ID" }),
    seatIds: z
        .array(z.string().uuid({ message: "Invalid seat ID" }))
        .min(1, { message: "At least one seat ID is required" })
        .max(10, { message: "You can lock a maximum of 10 seats at a time" }),
});

export const confirmReservationSchema = z.object({
  reservationId: z.string().uuid({ message: 'Invalid reservation ID' }),
});

export type LockSeatsInput = z.infer<typeof loackSeatsSchema>;
export type ConfirmReservationInput = z.infer<typeof confirmReservationSchema>;
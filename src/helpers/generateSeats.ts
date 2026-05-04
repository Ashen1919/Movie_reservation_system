export const generateSeats = (showtimeId: string, rows: string[], seatsPerRow: number) => {
    const seats = [];
    for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            seats.push({
                showtimeId,
                seatNumber: `${row}${i}`,
                status: 'AVAILABLE' as const,
            });
        };
    };
    return seats;
};
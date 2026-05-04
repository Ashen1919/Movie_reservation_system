/**
 * @openapi
 * /api/showtimes:
 *   post:
 *     tags: [Showtimes]
 *     summary: Create a new showtime with auto seat generation (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId, startTime, price, hallName]
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "movie-uuid"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-10T14:00:00.000Z"
 *               price:
 *                 type: number
 *                 example: 12.50
 *               hallName:
 *                 type: string
 *                 example: "Hall A"
 *               rows:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A", "B", "C", "D", "E"]
 *                 description: Optional custom rows (default A-J)
 *               seatsPerRow:
 *                 type: integer
 *                 example: 20
 *                 description: Optional seats per row (default 20)
 *     responses:
 *       201:
 *         description: Showtime created successfully with seats generated
 *       400:
 *         description: Movie not found or hall already booked for this time slot
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @openapi
 * /api/showtimes/{id}:
 *   patch:
 *     tags: [Showtimes]
 *     summary: Update a showtime by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-10T16:00:00.000Z"
 *               price:
 *                 type: number
 *                 example: 15.00
 *               hallName:
 *                 type: string
 *                 example: "Hall B"
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       400:
 *         description: Showtime not found or hall already booked for this time slot
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Showtime not found
 */

/**
 * @openapi
 * /api/showtimes/{id}:
 *   delete:
 *     tags: [Showtimes]
 *     summary: Delete a showtime by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Showtime not found
 */

/**
 * @openapi
 * /api/showtimes/{id}/seats:
 *   get:
 *     tags: [Showtimes]
 *     summary: Get seats for a showtime grouped by row (Auth required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Seats retrieved successfully grouped by row
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Showtime not found
 */
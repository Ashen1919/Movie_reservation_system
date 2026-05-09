/**
 * @openapi
 * /api/reservations/lock:
 *   post:
 *      summary: Lock seats for a reservation
 *      tags: [Reservations]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showtimeId, seatIds]
 *             properties:
 *               showtimeId:
 *                 type: string
 *                 example: "showtime-uuid"
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["seat-uuid1", "seat-uuid2"]
 *      responses:
 *        200:
 *          description: Seats locked successfully
 *        400:
 *          description: Invalid request body
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Showtime or seats not found
 */

/**
 * @openapi
 * /api/reservations/my:
 *   get:
 *      summary: Get user's reservations
 *      tags: [Reservations]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User's reservations retrieved successfully
 *        401:
 *          description: Unauthorized
 */

/**
 * @openapi
 * /api/reservations/cancel/{id}:
 *   delete:
 *      summary: Cancel a reservation
 *      tags: [Reservations]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Reservation ID
 *      responses:
 *        200:
 *          description: Reservation cancelled successfully
 *        400:
 *          description: Invalid reservation or cancellation not allowed
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Reservation not found
 */

/**
 * @openapi
 * /api/reservations:
 *   get:
 *      summary: Get all reservations (Admin only)
 *      tags: [Reservations]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            default: 1
 *          description: Page number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            default: 20
 *          description: Number of reservations per page
 *      responses:
 *        200:
 *          description: Reservations retrieved successfully
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Admin access required
 */

/**
 * @openapi
 * /api/webhooks/stripe:
 *   post:
 *      summary: Stripe webhook endpoint
 *      tags: [Webhooks]
 *      description: Handles Stripe payment events
 *      responses:
 *        200:
 *          description: Webhook processed successfully
 *        400:
 *          description: Invalid Stripe signature
 */
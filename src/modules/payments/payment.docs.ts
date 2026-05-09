/**
 * @openapi
 * /api/payments/create-intent:
 *   post:
 *      summary: Create Stripe payment intent
 *      tags: [Payments]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [reservationId]
 *              properties:
 *                reservationId:
 *                  type: string
 *                  example: "reservation-uuid"
 *      responses:
 *        200:
 *          description: Payment intent created successfully
 *        400:
 *          description: Invalid request
 *        401:
 *          description: Unauthorized
 *        403:
 *          description: Forbidden
 *        404:
 *          description: Reservation not found
 */
/**
 * @openapi
 * /api/users/me:
 *  get:
 *      tags: [Users]
 *      summary: Get logged in user details
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully retrieve the user
 *          404:
 *              description: User not found.
 *                  
 */

/**
 * @openapi
 * /api/users:
 *  get:
 *      tags: [Users]
 *      summary: Get all users list
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successfully retrieve all users
 *          500:
 *              description: No any user found
 */

/**
 * @openapi
 * /api/users/{id}/block:
 *   patch:
 *     tags: [Users]
 *     summary: Block a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to block
 *     responses:
 *       200:
 *         description: Successfully blocked the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to block the user
 */

/**
 * @openapi
 * /api/users/{id}/unblock:
 *   patch:
 *     tags: [Users]
 *     summary: Unblock a user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unblock
 *     responses:
 *       200:
 *         description: Successfully unblocked the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to unblock the user
 */
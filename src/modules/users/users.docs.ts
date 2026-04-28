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
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
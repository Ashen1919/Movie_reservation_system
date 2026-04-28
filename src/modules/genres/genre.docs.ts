/**
 * @openapi
 * /api/genres:
 *  post:
 *      tags: [Genre]
 *      summary: Create new genre
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      type: object
 *                      required: [name]
 *                      properties: 
 *                          name:
 *                              type: string
 *                              example: Actions
 *      responses:
 *          201:
 *              description: Genre created successfully
 *          409:
 *              description: Name is already exist
 */

/**
 * @openapi
 * /api/genres:
 *  get:
 *      tags: [Genre]
 *      summary: Get all genres
 *      security: []
 *      responses: 
 *          200:
 *              description: Successfully retrieve all genres
 *          500:
 *              description: Fail to retrieve all genres
 */
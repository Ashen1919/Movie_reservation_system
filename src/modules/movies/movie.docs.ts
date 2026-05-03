/**
 * @openapi
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: Get all movies with pagination
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of movies per page (default 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved all movies
 *       400:
 *         description: Failed to retrieve movies
 */

/**
 * @openapi
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Get a movie by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the movie
 *       400:
 *         description: Movie ID is required
 *       404:
 *         description: Movie not found
 */

/**
 * @openapi
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Create a new movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, durationMinutes, genreIds]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: A mind-bending thriller
 *               durationMinutes:
 *                 type: integer
 *                 example: 148
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["genre-uuid-1", "genre-uuid-2"]
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: One or more genreIds do not exist or movie with same title already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */

/**
 * @openapi
 * /api/movies/{id}/poster:
 *   post:
 *     tags: [Movies]
 *     summary: Upload a poster for a movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [poster]
 *             properties:
 *               poster:
 *                 type: string
 *                 format: binary
 *                 description: Poster image file (jpg, jpeg, png, webp) max 5MB
 *     responses:
 *       200:
 *         description: Poster uploaded successfully
 *       400:
 *         description: Poster file is required or Movie ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Movie not found
 */

/**
 * @openapi
 * /api/movies/{id}:
 *   patch:
 *     tags: [Movies]
 *     summary: Update a movie by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: A mind-bending thriller
 *               durationMinutes:
 *                 type: integer
 *                 example: 148
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["genre-uuid-1", "genre-uuid-2"]
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Movie ID is required or one or more genreIds do not exist
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Movie not found
 */

/**
 * @openapi
 * /api/movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Movie ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Movie not found
 */
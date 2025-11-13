import router from 'express';
import { validateMiddleware } from '../middleware/payloadValidator'
import { getMovieQuerySchema, getTvShowSchema } from '../validation/contentValidation.schema';
import { getMovieList, getTvShowList } from '../controllers/content.controller';


const contentRouter = router.Router();
/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Movie and TV show endpoints
 */

/**
 * @swagger
 * /api/content/movie:
 *   get:
 *     summary: Get list of movies
 *     tags: [Content]
 *     security:
 *       - access_token: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: genre
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - Action
 *             - Comedy
 *             - Drama
 *             - Fantasy
 *             - Horror
 *             - Romance
 *             - SciFi
 *         description: Filter movies by genre.
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Inception
 *         description: Search movies by title or keyword.
 *     responses:
 *       200:
 *         description: List of movies
 */
contentRouter.get('/movie', validateMiddleware({ query: getMovieQuerySchema }), getMovieList);
/**
 * @swagger
 * /api/content/tvshow:
 *   get:
 *     summary: Get list of TV shows
 *     security:
 *       - access_token: []
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: genre
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - Action
 *             - Comedy
 *             - Drama
 *             - Fantasy
 *             - Horror
 *             - Romance
 *             - SciFi
 *         description: Filter movies by genre.
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Inception
 *         description: Search movies by title or keyword
 *     responses:
 *       200:
 *         description: List of TV shows
 */
contentRouter.get('/tvshow', validateMiddleware({ query: getTvShowSchema }), getTvShowList);

export default contentRouter;
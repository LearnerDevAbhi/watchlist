import router from 'express';
import {addToWatchList,getWatchList, removeFromWathcList}  from '../controllers/watchList.controller';
import { validateMiddleware } from '../middleware/payloadValidator'
import { addToWatchListSchema, removeFromWathcListSchema, getWatchListSchema } from '../validation/watchListValidation.schema';

const watchListRouter = router.Router();
/**
 * @swagger
 * tags:
 *   name: WatchList
 *   description: Manage user watch list
 */

/**
 * @swagger
 * /api/watch_list:
 *   post:
 *     summary: Add content to user's watchlist
 *     security:
 *       - access_token: []
 *     tags: [WatchList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               movieId:
 *                 type: string
 *                 format: uuid
 *                 example: 111e8400-e29b-41d4-a716-446655440000
 *                 description: Must provide either movieId or tvShowId (xor)
 *               tvShowId:
 *                 type: string
 *                 format: uuid
 *                 example: 222e8400-e29b-41d4-a716-446655440000
 *                 description: Must provide either movieId or tvShowId (xor)
 *               rating:
 *                 type: number
 *                 example: 4.5
 *                 description: Optional rating for the item
 *     responses:
 *       201:
 *         description: Added to watchlist
 */
watchListRouter.post('/',validateMiddleware({body:addToWatchListSchema}), addToWatchList);

/**
 * @swagger
 * /api/watch_list/{id}:
 *   delete:
 *     summary: Remove content from user's watchlist
 *     tags: [WatchList]
 *     security:
 *       - access_token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed successfully
 */
watchListRouter.delete('/:id',validateMiddleware({params:removeFromWathcListSchema}), removeFromWathcList);

/**
 * @swagger
 * /api/watch_list:
 *   get:
 *     summary: Get user's watch list
 *     tags: [WatchList]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of items per page
 *       - in: query
 *         name: contentType
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - movie
 *             - tvshow
 *             - both
 *         description: Filter results by item type
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         description: The UUID of the user whose watch list is requested
 *     security:
 *       - access_token: []
 *     responses:
 *       200:
 *         description: List of user's watchlist items
 */
watchListRouter.get('/',validateMiddleware({query:getWatchListSchema}), getWatchList);

export default watchListRouter;
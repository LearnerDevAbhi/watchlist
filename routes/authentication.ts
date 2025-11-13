import router from 'express';
import authController  from '../controllers/authentication.controller';
import { validateMiddleware } from '../middleware/payloadValidator'
import { loginAuthSchema,refreshTokenSchema } from '../validation/authValidation.schema';

const authRouter = router.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Auth endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in user and return tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 */
authRouter.post('/login', validateMiddleware({body:loginAuthSchema}), authController.login);
/**
 * @swagger
 * /api/auth/refreshToken:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: MyStrongPassword123
 *     security:
 *       - refresh_token: []
 *     responses:
 *       200:
 *         description: Token refreshed
 */
authRouter.post('/refreshToken',authController.refreshToken);

export default authRouter;
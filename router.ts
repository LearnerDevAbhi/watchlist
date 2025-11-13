import express from 'express';
const router = express.Router();
import watchList from './routes/watchList';
import authentication from './routes/authentication';
import {validateToken} from './middleware/auth'
import contentRouter from './routes/content';
router.use('/auth', authentication);
router.use('/content',validateToken, contentRouter);
router.use('/watch_list',validateToken, watchList);

export default router;
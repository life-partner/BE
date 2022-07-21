require('dotenv').config();
import express from 'express';
import auth from '../auth';
import article_controller from '../controllers/article';

const router = express.Router();

router.post('/articles', auth, article_controller.post);
router.get('/articles', auth, article_controller.main);
router.get('/articles/detail/:articleId', auth, article_controller.detail);
router.get('/point', auth, article_controller.point);
router.patch('/articles/:articleId', auth, article_controller.change_status);
router.patch('/articles/:articleId/partners', auth, article_controller.choice);
router.get('/articles/search', auth, article_controller.search);

export default router;

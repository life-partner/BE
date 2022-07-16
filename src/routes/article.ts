require('dotenv').config();
import express from 'express';
import auth from '../auth';
import article_controller from '../controllers/article';

const router = express.Router();

router.post('/articles', auth, article_controller.post);
router.get('/articles', article_controller.main);
router.get('/:articleId', article_controller.detail);
router.get('/point', auth, article_controller.point);
router.patch('/:articleId/partners', auth, article_controller.choice);
router.patch('/:articleId', auth, article_controller.change_status);

export default router;

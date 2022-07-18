require('dotenv').config();
import express from 'express';
import auth from '../auth';
import article_controller from '../controllers/article';

const router = express.Router();

router.post('/articles', auth, article_controller.post);
router.get('/articles', auth, article_controller.main);
router.get('/:articleId', auth, article_controller.detail);
router.get('/point', auth, article_controller.point);
router.patch('/:articleId', auth, article_controller.change_status);
router.patch('/:articleId/partners', auth, article_controller.choice);

export default router;

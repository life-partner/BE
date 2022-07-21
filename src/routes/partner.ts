require('dotenv').config();
import express from 'express';
import auth from '../auth';
import partner_controller from '../controllers/partner';

const router = express.Router();

router.get('/partners/:articleId/list', auth, partner_controller.partners_list);
router.post('/partners/:articleId/post', auth, partner_controller.partners_post);

export default router;

require('dotenv').config();
import express from 'express';
import auth from '../auth';
import partner_controller from '../controllers/partner';

const router = express.Router();

router.get('/:articleId/partners', auth, partner_controller.partners);
router.patch('/:articleId/partners', auth, partner_controller.choice);

export default router;
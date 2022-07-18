require('dotenv').config();
import express from 'express';
import auth from '../auth';
import user_controller from '../controllers/user';

const router = express.Router();

router.post('/users/signup', user_controller.signup);
router.post('/users/login', user_controller.login);
router.get('/users/user-info', auth, user_controller.user_info);
router.patch('/users/user-info/password', auth, user_controller.modify_password);
router.patch('/users/user-info/phone', auth, user_controller.modify_phone);
router.patch('/users/user-info/address', auth, user_controller.modify_address);
router.patch('/users/user-info/bank-account', auth, user_controller.modify_account);
router.delete('/users/withdraw', auth, user_controller.withdraw);

export default router;

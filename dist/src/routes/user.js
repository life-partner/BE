"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../auth"));
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
router.post('/users/signup', user_1.default.signup);
router.post('/users/login', user_1.default.login);
router.get('/users/user-info', auth_1.default, user_1.default.user_info);
router.patch('/users/user-info/password', auth_1.default, user_1.default.modify_password);
router.patch('/users/user-info/phone', auth_1.default, user_1.default.modify_phone);
router.patch('/users/user-info/address', auth_1.default, user_1.default.modify_address);
router.patch('/users/user-info/bank-account', auth_1.default, user_1.default.modify_account);
router.delete('/users/withdraw', auth_1.default, user_1.default.withdraw);
exports.default = router;
//# sourceMappingURL=user.js.map
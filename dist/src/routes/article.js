"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../auth"));
const article_1 = __importDefault(require("../controllers/article"));
const router = express_1.default.Router();
router.post('/articles', auth_1.default, article_1.default.post);
router.get('/articles', auth_1.default, article_1.default.main);
router.get('/articles/detail/:articleId', auth_1.default, article_1.default.detail);
router.get('/point', auth_1.default, article_1.default.point);
router.patch('/articles/:articleId', auth_1.default, article_1.default.change_status);
router.patch('/articles/:articleId/partners', auth_1.default, article_1.default.choice);
router.get('/articles/search', auth_1.default, article_1.default.search);
exports.default = router;
//# sourceMappingURL=article.js.map
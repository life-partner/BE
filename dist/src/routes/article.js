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
router.get('/:articleId', auth_1.default, article_1.default.detail);
router.get('/point', auth_1.default, article_1.default.point);
router.patch('/:articleId', auth_1.default, article_1.default.change_status);
router.patch('/:articleId/partners', auth_1.default, article_1.default.choice);
exports.default = router;
//# sourceMappingURL=article.js.map
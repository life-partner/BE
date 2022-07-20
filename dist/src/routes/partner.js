"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../auth"));
const partner_1 = __importDefault(require("../controllers/partner"));
const router = express_1.default.Router();
router.get('/:articleId/partners', auth_1.default, partner_1.default.partners);
exports.default = router;
//# sourceMappingURL=partner.js.map
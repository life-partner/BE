"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("../DBindex"));
const partners = (req, res) => {
    const { article_id } = req.params;
    let nickname = [];
    try {
        DBindex_1.default.query('select nickname from parner where articleId=?', article_id, (error, result) => {
            if (error)
                return res.json({
                    result: false,
                });
            for (let i = 0; i < result[0].length; i++) {
                nickname.push(result[0].nickname);
            }
            console.log('list of partners: ', nickname);
            res.json({
                result: true,
                partners: nickname,
            });
        });
    }
    catch (error) {
        return res.json({
            result: false,
        });
    }
};
exports.default = { partners };
//# sourceMappingURL=partner.js.map
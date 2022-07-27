"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("../DBindex"));
const partners_list = (req, res) => {
    const { articleId } = req.params;
    let data = [];
    try {
        DBindex_1.default.query('select partner from partner where article_id=?', articleId, (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            if (result.length > 5)
                return res.status(400).json({
                    result: false,
                    err_code: 444,
                });
            for (let i = 0; i < result.length; i++) {
                data.push(result[i].partner);
            }
            return res.status(200).json({
                result: true,
                partners: data,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const partners_post = (req, res) => {
    const { articleId } = req.params;
    const { user } = res.locals;
    try {
        DBindex_1.default.query('select * from partner where aritlce_id=? and partner=?', [articleId, user.nickname], (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            if (result[0].length > 0)
                return res.status(400).json({
                    result: false,
                });
            DBindex_1.default.query('insert into partner(article_id, partner, date) values(?, ?, date_format(curdate(), "%Y-%m-%d"))', [articleId, user.nickname], (error) => {
                if (error)
                    return res.status(400).json({
                        result: false,
                    });
                return res.status(200).json({
                    result: true,
                });
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
exports.default = { partners_list, partners_post };
//# sourceMappingURL=partner.js.map
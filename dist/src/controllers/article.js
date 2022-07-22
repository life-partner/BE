"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("../DBindex"));
const post = (req, res) => {
    const { user } = res.locals;
    const { location, detail_location, gu, dong, price, period, use_point, point_earned, title, contents, post_bank, post_account, post_holder, } = req.body;
    const query = 'insert into article(location, detail_location, gu, dong, price, period, use_point, title, contents, post_bank, post_account, post_holder, point_earned, writer, date) ' +
        'values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date_format(curdate(), "%Y-%m-%d"))';
    const values = [
        location,
        detail_location,
        gu,
        dong,
        price,
        period,
        use_point,
        title,
        contents,
        post_bank,
        post_account,
        post_holder,
        point_earned,
        user.nickname,
    ];
    try {
        DBindex_1.default.query(query, values, (error, result) => {
            if (error) {
                return res.status(401).json({
                    result: false,
                });
            }
            return res.status(201).json({
                result: true,
            });
        });
    }
    catch (error) {
        console.log('catch error in article_post: ', error);
        return res.status(401).json({
            result: false,
        });
    }
};
const main = (req, res) => {
    let is_user = false;
    if (res.locals.user)
        is_user = true;
    try {
        DBindex_1.default.query('select *, date_format(date, "%Y-%m-%d") as date from article where status="waiting"', (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            return res.status(200).json({
                result: true,
                is_user: is_user,
                articles: result,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const detail = (req, res) => {
    let is_user = false;
    if (res.locals.user)
        is_user = true;
    const { articleId } = req.params;
    try {
        DBindex_1.default.query('select * from article where id=?', articleId, (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            return res.status(200).json({
                result: true,
                is_user: is_user,
                article: result,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const point = (req, res) => {
    let data = [];
    const { user } = res.locals;
    try {
        DBindex_1.default.query('select article.id, article.point_earned, date_format(article.date, "%Y-%m-%d") as date, user.current_point from article left join user on article.partner = user.nickname where article.partner=? order by article.id desc', user.nickname, (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            if (result.length < 1)
                return res.status(400).json({
                    result: false,
                });
            for (let i = 0; i < result.length; i++) {
                data.push({ id: result[i].id, point_earned: result[i].point_earned, date: result[i].date });
            }
            return res.status(200).json({
                result: true,
                current_point: result[0].current_point,
                history: data,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const change_status = (req, res) => {
    const { status } = req.body;
    const { articleId } = req.params;
    try {
        DBindex_1.default.query('update article set status=? where id=?', [status, articleId], (error) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
        });
        return res.status(200).json({
            result: true,
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const choice = (req, res) => {
    const { nickname } = req.body;
    const { articleId } = req.params;
    try {
        DBindex_1.default.query('update article set status="matching", partner=? where id=?', [nickname, articleId], (error) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            return res.status(200).json({
                result: true,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
const search = (req, res) => {
    let is_user = false;
    if (res.locals.user)
        is_user = true;
    const { minprice, maxperiod, location1, location2, location3 } = req.query;
    const [location1_gu, location1_dong] = location1.split(' ');
    const [location2_gu, location2_dong] = location2.split(' ');
    const [location3_gu, location3_dong] = location3.split(' ');
    try {
        DBindex_1.default.query('select *, date_format(date, "%Y-%m-%d") as date from article where price >= ? and ? >= period and status="waiting" and ((gu=? and dong=?) or (gu=? and dong=?) or (gu=? and dong=?))', [minprice, maxperiod, location1_gu, location1_dong, location2_gu, location2_dong, location3_gu, location3_dong], (error, result) => {
            if (error)
                return res.status(400).json({
                    result: false,
                });
            return res.status(200).json({
                result: true,
                is_user: is_user,
                articles: result,
            });
        });
    }
    catch (error) {
        return res.status(400).json({
            result: false,
        });
    }
};
exports.default = { post, main, detail, point, change_status, choice, search };
//# sourceMappingURL=article.js.map
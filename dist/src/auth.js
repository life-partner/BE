"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("./DBindex"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(400).json({ result: false });
    const [token_type, token_value] = authorization.split(' ');
    if (token_type === 'NOT')
        return next();
    if (token_type !== 'Bearer')
        return res.status(400).json({ result: false });
    try {
        const { id } = jsonwebtoken_1.default.verify(token_value, process.env.TOKEN_SECRET_KEY);
        DBindex_1.default.query('select * from user where id=?', id, (err, result) => {
            if (err)
                return res.status(400).json({ result: false });
            res.locals.user = result[0];
            next();
        });
    }
    catch (error) {
        console.log('catch error in auth: ', error);
        return res.status(400).json({ result: false });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map
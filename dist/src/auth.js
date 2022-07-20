"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("./DBindex"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(400).json({ result: false });
    const [token_type, token_value] = authorization.split(' ');
    if (token_type === 'NOT')
        next();
    if (token_type !== 'Bearer')
        return res.status(400).json({ result: false });
    try {
        const { id } = jsonwebtoken_1.default.verify(token_value, process.env.TOKEN_SECRET_KEY);
        yield DBindex_1.default.query('select * from user where id=?', id, (err, result) => {
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
});
exports.default = auth;
//# sourceMappingURL=auth.js.map
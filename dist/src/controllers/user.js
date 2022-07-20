"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const DBindex_1 = __importDefault(require("../DBindex"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => {
    const { nickname, password, phone, address, detail_address, bank, account, holder } = req.body;
    // 필수 데이터 중 하나라도 빈 값으로 넘어오면 예외 처리
    if (!nickname || !password || !phone || !address || !detail_address)
        return res.status(401).json({
            result: false,
            err_code: 401,
        });
    try {
        // 중복 닉네임 확인
        DBindex_1.default.query('select nickname from user where nickname=?', nickname, (error, result) => {
            if (result.length > 0)
                return res.status(401).json({
                    result: false,
                    err_code: 401,
                });
        });
        const privateKey = process.env.PASSWORD_SECRET_KEY;
        const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(password), privateKey).toString();
        const query = 'insert into user(nickname, password, phone, address, detail_address, bank, account, holder, current_point) ' +
            'values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const value = [nickname, encrypted, phone, address, detail_address, bank, account, holder, 1000];
        DBindex_1.default.query(query, value, () => {
            return res.status(201).json({
                result: true,
            });
        });
    }
    catch (error) {
        console.log('catch error in signup: ', error);
        return res.status(401).json({
            result: false,
        });
    }
};
const login = (req, res) => {
    const { nickname, password } = req.body;
    try {
        const privateKey = process.env.PASSWORD_SECRET_KEY;
        DBindex_1.default.query('select * from user where nickname=?', nickname, (error, result) => {
            if (result[0].length < 1) {
                return res.status(401).json({
                    result: false,
                    err_code: 401,
                });
            }
            const bytes = crypto_js_1.default.AES.decrypt(result[0].password, privateKey);
            const decrypted = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
            if (password === decrypted) {
                const token = jsonwebtoken_1.default.sign({
                    id: result[0].id,
                }, process.env.TOKEN_SECRET_KEY);
                return res.status(200).json({
                    result: true,
                    token: token,
                });
            }
            else {
                return res.status(400).json({
                    result: false,
                    message: '비밀번호가 틀립니다. 다시 확인해주세요.',
                });
            }
        });
    }
    catch (error) {
        console.log('catch error in login: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
const user_info = (req, res) => {
    const { user } = res.locals;
    return res.status(200).json({
        nickname: user.nickname,
        phone: user.phone,
        address: user.address,
        detail_address: user.detail_address,
        bank: user.bank,
        account: user.account,
        holder: user.holder,
        current_point: user.current_point,
    });
};
const modify_password = (req, res) => {
    const { user } = res.locals;
    const { password, modifiedPassword } = req.body;
    try {
        const privateKey = process.env.PASSWORD_SECRET_KEY;
        const bytes = crypto_js_1.default.AES.decrypt(user.password, privateKey);
        const decrypted = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
        const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(modifiedPassword), privateKey).toString();
        DBindex_1.default.query('select * from user where nickname=?', user.nickname, (error, result) => {
            if (password === decrypted) {
                DBindex_1.default.query('update user set password=? where nickname=?', [encrypted, user.nickname], (error, result) => {
                    if (error) {
                        return res.status(400).json({
                            result: false,
                        });
                    }
                    return res.status(200).json({
                        result: true,
                    });
                });
            }
            else {
                return res.status(400).json({
                    result: false,
                });
            }
        });
    }
    catch (error) {
        console.log('catch error in modify_password: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
const modify_phone = (req, res) => {
    const { user } = res.locals;
    const { phone } = req.body;
    try {
        DBindex_1.default.query('update user set phone=? where nickname=?', [phone, user.nickname], (error, result) => {
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
        console.log('catch error in modify_phone: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
const modify_address = (req, res) => {
    const { user } = res.locals;
    const { address, detail_address } = req.body;
    try {
        DBindex_1.default.query('update user set address=?, detail_address=? where nickname=?', [address, detail_address, user.nickname], (error, result) => {
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
        console.log('catch error in modify_address: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
const modify_account = (req, res) => {
    const { user } = res.locals;
    const { bank, account, holder } = req.body;
    try {
        DBindex_1.default.query('update user set bank=?, account=?, holder=? where nickname=?', [bank, account, holder, user.nickname], (error, result) => {
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
        console.log('catch error in modify_account: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
const withdraw = (req, res) => {
    const { user } = res.locals;
    try {
        DBindex_1.default.query('delete from user where nickname=?', user.nickname, (error) => {
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
        console.log('catch error in withdraw: ', error);
        return res.status(400).json({
            result: false,
        });
    }
};
exports.default = { signup, login, user_info, modify_password, modify_phone, modify_address, modify_account, withdraw };
//# sourceMappingURL=user.js.map
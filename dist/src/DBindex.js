"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mysql_1 = __importDefault(require("mysql"));
const db = mysql_1.default.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'life_partner',
    port: 3306,
});
exports.default = db;
//# sourceMappingURL=DBindex.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const article_1 = __importDefault(require("./routes/article"));
const partner_1 = __importDefault(require("./routes/partner"));
const DBindex_1 = __importDefault(require("./DBindex"));
const app = (0, express_1.default)();
DBindex_1.default.connect();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use('/api', [user_1.default, article_1.default, partner_1.default]);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`
  ################################################
  🛡️  Server listening...
  ################################################
`);
});
//# sourceMappingURL=server.js.map
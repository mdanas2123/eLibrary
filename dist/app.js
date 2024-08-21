"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./Middleware/globalErrorHandler"));
const userRouter_1 = __importDefault(require("./user/userRouter"));
const bookRouter_1 = __importDefault(require("./books/bookRouter"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log("frontend domain is : ", config_1.config.frontendDomain);
app.use((0, cors_1.default)({
    origin: config_1.config.frontendDomain,
    credentials: true,
}));
// app.get("/", (req, res) => {
//     res.json({ massage: "welcome to my eLibrary" })
// })
app.all("/", (req, res) => {
    res.json({ massage: "welcome to my eLibrary" });
});
app.use("/api/users", userRouter_1.default);
app.use("/api/books", bookRouter_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;

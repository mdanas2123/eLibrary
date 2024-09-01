"use strict";
// import express from "express";
// import globalErrorHandler from "./Middleware/globalErrorHandler";
// import userRouter from "./user/userRouter";
// import bookRouter from "./books/bookRouter";
// import cors from "cors";
// import { config } from "./config/config";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// app.use(express.json());
// console.log("frontend domain is : ", config.frontendDomain)
// app.use(
//     cors({
//         origin: config.frontendDomain,
//         credentials: true,
//     })
// )
// app.get("/", (req, res) => {
//     res.json({ massage: "welcome to my eLibrary" })
// })
// app.use("/api/users", userRouter)
// app.use("/api/books", bookRouter)
// app.use(globalErrorHandler)
// export default app;
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./Middleware/globalErrorHandler"));
const userRouter_1 = __importDefault(require("./user/userRouter"));
const bookRouter_1 = __importDefault(require("./books/bookRouter"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log("Frontend domain is:", config_1.config.frontendDomain);
// Simplified CORS configuration
app.use((0, cors_1.default)({
    origin: [config_1.config.frontendDomain || "https://www.flipkart.com", "https://e-lib-frontend.vercel.app"], // Allow only the frontend domain
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allow specific HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allow specific headers
    optionsSuccessStatus: 204, // Response status for successful OPTIONS requests
}));
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Handle preflight `OPTIONS` requests
app.options("*", (0, cors_1.default)());
// Basic route to check if the server is running
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my eLibrary" });
});
// API routes
app.use("/api/users", userRouter_1.default);
app.use("/api/books", bookRouter_1.default);
// Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;

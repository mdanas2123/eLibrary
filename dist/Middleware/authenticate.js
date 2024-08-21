"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.header("authorization");
    if (!token) {
        const error = (0, http_errors_1.default)(401, "No token provided");
        return next(error);
    }
    try {
        const parsedToken = token.split(' ')[1];
        const decoded = (0, jsonwebtoken_1.verify)(parsedToken, config_1.config.jwtSecret);
        const _req = req;
        _req.userId = decoded.sub;
        next();
    }
    catch (error) {
        return next((0, http_errors_1.default)(401, "token han been expire"));
    }
};
exports.default = authenticate;

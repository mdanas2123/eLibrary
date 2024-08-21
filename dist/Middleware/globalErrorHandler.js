"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const globalErrorHandler = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message: err.message,
        error: config_1.config.env === 'development' ? err.stack : ''
    });
};
exports.default = globalErrorHandler;

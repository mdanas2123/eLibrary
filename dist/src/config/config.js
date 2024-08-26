"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    mongoURL: process.env.Database_connection_string,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryName: process.env.Cloudinary_Name,
    cloudinarykey: process.env.Cloudinary_key,
    cloudinarySecret: process.env.Cloudinary_Secret,
    frontendDomain: process.env.Frontend_Domain
};
exports.config = Object.freeze(_config);

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
exports.loginUser = exports.createUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModel_1 = __importDefault(require("./userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = (0, http_errors_1.default)(400, "All feild are required");
        return next(error);
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const error = (0, http_errors_1.default)(400, "User already exist");
            return next(error);
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "error while getting user "));
    }
    const hashedPasswrd = yield bcrypt_1.default.hash(password, 10);
    let newUser;
    try {
        newUser = yield userModel_1.default.create({
            name,
            email,
            password: hashedPasswrd
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "error while creting user"));
    }
    try {
        const token = (0, jsonwebtoken_1.sign)({ sub: newUser._id }, config_1.config.jwtSecret, { expiresIn: "7d", algorithm: "HS256" });
        res.status(201).json({ accessToken: token });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "error while signing jwt token"));
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = (0, http_errors_1.default)(400, "All feild are required");
        return next(error);
    }
    let user;
    try {
        user = yield userModel_1.default.findOne({ email });
        if (!user) {
            const error = (0, http_errors_1.default)(404, "User not found");
            return next(error);
        }
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "error while getting user "));
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        const error = (0, http_errors_1.default)(400, "Invalid password");
        return next(error);
    }
    try {
        const token = (0, jsonwebtoken_1.sign)({ sub: user._id }, config_1.config.jwtSecret, { expiresIn: "7d", algorithm: "HS256" });
        res.status(201).json({ accessToken: token });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "error while signing jwt token"));
    }
});
exports.loginUser = loginUser;

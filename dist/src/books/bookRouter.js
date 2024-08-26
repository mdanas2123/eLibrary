"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
// import path from "node:path";
const bookController_1 = require("./bookController");
const authenticate_1 = __importDefault(require("../Middleware/authenticate"));
const bookRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    // dest: path.resolve(__dirname, "../../public/data/uploads"),
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});
bookRouter.post("/", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookController_1.createBook);
bookRouter.patch("/:bookId", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), bookController_1.updateBook);
bookRouter.get("/", bookController_1.bookList);
bookRouter.get("/:bookId", bookController_1.getSinglebook);
bookRouter.delete("/:bookId", authenticate_1.default, bookController_1.deleteBook);
exports.default = bookRouter;

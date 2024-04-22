import express from "express";
import multer from "multer";
import path from "node:path";
import { createBook, updateBook } from "./bookController";
import authenticate from "../Middleware/authenticate";

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

bookRouter.post("/",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 }
    ]),
    createBook
);
bookRouter.patch("/:bookId",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 }
    ]),
    updateBook
);

export default bookRouter;



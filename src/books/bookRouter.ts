import express from "express";
import multer from "multer";
// import path from "node:path";
import { createBook, updateBook, bookList, getSinglebook, deleteBook } from "./bookController";
import authenticate from "../Middleware/authenticate";

const bookRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    // dest: path.resolve(__dirname, "../../public/data/uploads"),
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

bookRouter.post("/",
    authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },

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
bookRouter.get("/", bookList)
bookRouter.get("/:bookId", getSinglebook)
bookRouter.delete("/:bookId", authenticate, deleteBook)

export default bookRouter;



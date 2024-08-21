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
exports.deleteBook = exports.getSinglebook = exports.bookList = exports.updateBook = exports.createBook = void 0;
// import path from 'node:path';
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const http_errors_1 = __importDefault(require("http-errors"));
const bookModel_1 = __importDefault(require("./bookModel"));
const node_fs_1 = __importDefault(require("node:fs"));
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, genre, description, authorName } = req.body;
    const files = req.files;
    try {
        const uploadPromises = [];
        const coverImage = files.coverImage[0];
        const coverImageUpload = cloudinary_1.default.uploader.upload(coverImage.path, {
            folder: "book-covers",
            format: coverImage.mimetype.split('/').at(-1),
        });
        uploadPromises.push(coverImageUpload);
        const bookFile = files.file[0];
        const bookFileUpload = cloudinary_1.default.uploader.upload(bookFile.path, {
            resource_type: 'raw',
            // folder: "book-pdfs",
            // format: "application/pdf",
            format: bookFile.mimetype.split('/').at(-1)
        });
        uploadPromises.push(bookFileUpload);
        const [coverUploadResult, bookUploadResult] = yield Promise.all(uploadPromises);
        const _req = req;
        const newBook = yield bookModel_1.default.create({
            title,
            genre,
            description,
            authorName,
            author: _req.userId,
            coverImage: coverUploadResult.secure_url,
            file: bookUploadResult.secure_url
        });
        yield Promise.all([
            node_fs_1.default.promises.unlink(coverImage.path),
            node_fs_1.default.promises.unlink(bookFile.path)
        ]);
        res.status(201).json({ id: newBook._id });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, "Error while file uploading"));
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, genre, description, authorName } = req.body;
    const bookId = req.params.bookId;
    try {
        const book = yield bookModel_1.default.findById(bookId);
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "Unauthorized: You can't update this book"));
        }
        const files = req.files;
        const coverImage = files.coverImage ? files.coverImage[0] : null;
        const bookFile = files.file ? files.file[0] : null;
        // Define variables for old file URLs or public IDs
        let oldCoverImagePublicId = null;
        let oldBookFilePublicId = null;
        // If cover image is being updated, get old public ID and delete old file
        if (coverImage) {
            const coverFileSplit = book.coverImage.split("/");
            oldCoverImagePublicId = coverFileSplit.at(-2) + "/" + ((_a = coverFileSplit.at(-1)) === null || _a === void 0 ? void 0 : _a.split('.').at(-2));
            // Delete old cover image from Cloudinary
            yield cloudinary_1.default.uploader.destroy(oldCoverImagePublicId);
        }
        // If book file is being updated, get old public ID and delete old file
        if (bookFile) {
            const bookFileSplit = book.file.split("/");
            oldBookFilePublicId = bookFileSplit.at(-2) + "/" + (bookFileSplit.at(-1));
            // Delete old book file from Cloudinary (resource_type: raw)
            yield cloudinary_1.default.uploader.destroy(oldBookFilePublicId, {
                resource_type: 'raw',
            });
        }
        // Upload new files to Cloudinary
        let updatedCoverImage = book.coverImage;
        if (coverImage) {
            const coverUploadResult = yield cloudinary_1.default.uploader.upload(coverImage.path, {
                folder: "book-covers",
                format: coverImage.mimetype.split('/').at(-1),
            });
            updatedCoverImage = coverUploadResult.secure_url;
        }
        let updatedBookFile = book.file;
        if (bookFile) {
            const bookUploadResult = yield cloudinary_1.default.uploader.upload(bookFile.path, {
                resource_type: 'raw',
                folder: "book-pdfs",
                format: "pdf",
            });
            updatedBookFile = bookUploadResult.secure_url;
        }
        // Update book in the database with new file URLs
        const updatedBook = yield bookModel_1.default.findByIdAndUpdate(bookId, { title, genre, description: description, coverImage: updatedCoverImage, authorName, file: updatedBookFile }, { new: true });
        res.json(updatedBook);
    }
    catch (error) {
        next((0, http_errors_1.default)(500, "Error while updating book"));
    }
});
exports.updateBook = updateBook;
const bookList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield bookModel_1.default.find().populate({
            path: 'author',
            select: 'name description authorName'
        });
        res.json(books);
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Error in bookList"));
    }
});
exports.bookList = bookList;
const getSinglebook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const singleBook = yield bookModel_1.default.findOne({ _id: bookId }).populate({
            path: 'author',
            select: 'name description authorName '
        });
        if (!singleBook) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        res.json(singleBook);
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Error while getting a single Book"));
    }
});
exports.getSinglebook = getSinglebook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bookId = req.params.bookId;
    try {
        // Find the book by ID
        const book = yield bookModel_1.default.findById(bookId);
        // If book is not found, return 404 error
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        // Check if the current user is the author of the book
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "Unauthorized: You can't delete this book"));
        }
        // Split cover image URL
        const coverFileSplit = book.coverImage.split("/");
        const coverImagePublicId = coverFileSplit.at(-2) + "/" + ((_b = coverFileSplit.at(-1)) === null || _b === void 0 ? void 0 : _b.split('.').at(-2));
        const bookFileSplit = book.file.split("/");
        const bookFilePublicId = bookFileSplit.at(-2) + "/" + (bookFileSplit.at(-1));
        console.log("coverSplit", bookFilePublicId);
        // Add logic to delete book from database and cloudinary, then respond accordingly
        yield cloudinary_1.default.uploader.destroy(coverImagePublicId);
        yield cloudinary_1.default.uploader.destroy(bookFilePublicId, {
            resource_type: 'raw',
        });
        yield bookModel_1.default.deleteOne({ _id: bookId });
        return res.sendStatus(204);
    }
    catch (error) {
        next((0, http_errors_1.default)(500, "Internal server error"));
    }
});
exports.deleteBook = deleteBook;

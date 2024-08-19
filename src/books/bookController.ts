import { NextFunction, Response, Request } from "express";
// import path from 'node:path';
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../Middleware/authenticate";

const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, genre, description, authorName } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const uploadPromises = [];


        const coverImage = files.coverImage[0];
        const coverImageUpload = cloudinary.uploader.upload(coverImage.path, {
            folder: "book-covers",
            format: coverImage.mimetype.split('/').at(-1),
        });
        uploadPromises.push(coverImageUpload);


        const bookFile = files.file[0];
        const bookFileUpload = cloudinary.uploader.upload(bookFile.path, {
            resource_type: 'raw',
            // folder: "book-pdfs",
            // format: "application/pdf",
            format: bookFile.mimetype.split('/').at(-1)
        });
        uploadPromises.push(bookFileUpload);


        const [coverUploadResult, bookUploadResult] = await Promise.all(uploadPromises);


        const _req = req as AuthRequest;
        const newBook = await bookModel.create({
            title,
            genre,
            description,
            authorName,
            author: _req.userId,
            coverImage: coverUploadResult.secure_url,
            file: bookUploadResult.secure_url
        });


        await Promise.all([
            fs.promises.unlink(coverImage.path),
            fs.promises.unlink(bookFile.path)
        ]);

        res.status(201).json({ id: newBook._id });
    } catch (error) {
        next(createHttpError(500, "Error while file uploading"));
    }
};



const updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, genre, description, authorName } = req.body;
    const bookId = req.params.bookId;

    try {
        const book = await bookModel.findById(bookId);
        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized: You can't update this book"));
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const coverImage = files.coverImage ? files.coverImage[0] : null;
        const bookFile = files.file ? files.file[0] : null;

        // Define variables for old file URLs or public IDs
        let oldCoverImagePublicId = null;
        let oldBookFilePublicId = null;

        // If cover image is being updated, get old public ID and delete old file
        if (coverImage) {
            const coverFileSplit = book.coverImage.split("/");
            oldCoverImagePublicId = coverFileSplit.at(-2) + "/" + (coverFileSplit.at(-1)?.split('.').at(-2));

            // Delete old cover image from Cloudinary
            await cloudinary.uploader.destroy(oldCoverImagePublicId);
        }

        // If book file is being updated, get old public ID and delete old file
        if (bookFile) {
            const bookFileSplit = book.file.split("/");
            oldBookFilePublicId = bookFileSplit.at(-2) + "/" + (bookFileSplit.at(-1));

            // Delete old book file from Cloudinary (resource_type: raw)
            await cloudinary.uploader.destroy(oldBookFilePublicId, {
                resource_type: 'raw',
            });
        }

        // Upload new files to Cloudinary
        let updatedCoverImage = book.coverImage;
        if (coverImage) {
            const coverUploadResult = await cloudinary.uploader.upload(coverImage.path, {
                folder: "book-covers",
                format: coverImage.mimetype.split('/').at(-1),
            });
            updatedCoverImage = coverUploadResult.secure_url;
        }

        let updatedBookFile = book.file;
        if (bookFile) {
            const bookUploadResult = await cloudinary.uploader.upload(bookFile.path, {
                resource_type: 'raw',
                folder: "book-pdfs",
                format: "pdf",
            });
            updatedBookFile = bookUploadResult.secure_url;
        }

        // Update book in the database with new file URLs
        const updatedBook = await bookModel.findByIdAndUpdate(
            bookId,
            { title, genre, description: description, coverImage: updatedCoverImage, authorName, file: updatedBookFile },
            { new: true }
        );

        res.json(updatedBook);
    } catch (error) {
        next(createHttpError(500, "Error while updating book"));
    }
};


const bookList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await bookModel.find().populate({
            path: 'author',
            select: 'name description authorName'
        });

        res.json(books);


    } catch (error) {
        return next(createHttpError(500, "Error in bookList"));
    }
};



const getSinglebook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;
    try {
        const singleBook = await bookModel.findOne({ _id: bookId }).populate({
            path: 'author',
            select: 'name description authorName '
        });

        if (!singleBook) {
            return next(createHttpError(404, "Book not found"));
        }
        res.json(singleBook);
    } catch (error) {
        return next(createHttpError(500, "Error while getting a single Book"));
    }
};


const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;
    try {
        // Find the book by ID
        const book = await bookModel.findById(bookId);

        // If book is not found, return 404 error
        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        // Check if the current user is the author of the book
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized: You can't delete this book"));
        }

        // Split cover image URL
        const coverFileSplit = book.coverImage.split("/");
        const coverImagePublicId = coverFileSplit.at(-2) + "/" + (coverFileSplit.at(-1)?.split('.').at(-2));

        const bookFileSplit = book.file.split("/");
        const bookFilePublicId = bookFileSplit.at(-2) + "/" + (bookFileSplit.at(-1))
        console.log("coverSplit", bookFilePublicId);
        // Add logic to delete book from database and cloudinary, then respond accordingly
        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookFilePublicId, {
            resource_type: 'raw',
        });
        await bookModel.deleteOne({ _id: bookId })
        return res.sendStatus(204);
    } catch (error) {

        next(createHttpError(500, "Internal server error"));
    }
};



export { createBook, updateBook, bookList, getSinglebook, deleteBook };

// import { NextFunction, Response, Request } from "express";
// import path from 'node:path';
// import cloudinary from "../config/cloudinary";
// import createHttpError from "http-errors";
// import bookModel from "./bookModel";
// import fs from "node:fs";
// import { AuthRequest } from "../Middleware/authenticate";

// const createBook = async (
//     req: Request,
//     res: Response,
//     next: NextFunction) => {
//     const { title, genre } = req.body;


//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
//     const fileName = files.coverImage[0].filename;
//     // const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)
//     const filePath = path.resolve(__dirname, '../../public/data/uploads/', fileName);


//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             Filename_override: fileName,
//             folder: "book-covers",

//             format: coverImageMimeType,
//         });
//         const bookFileName = files.file[0].filename;
//         const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

//         const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
//             resource_type: 'raw',
//             Filename_override: bookFileName,
//             folder: "book-pdfs",
//             format: "pdf",
//         });
//         const _req = req as AuthRequest
//         const newBook = await bookModel.create({
//             title,
//             genre,
//             author: _req.userId,
//             coverImage: uploadResult.secure_url,
//             file: bookFileUploadResult.secure_url
//         });

//         await fs.promises.unlink(filePath);
//         await fs.promises.unlink(bookFilePath);
//         res.status(201).json({ id: newBook._id });

//     } catch (error) {

//         return next(createHttpError(500, "error while file uploading"))
//     }

// };

// const updateBook = async (
//     req: Request,
//     res: Response,
//     next: NextFunction) => {
//     const { title, genre } = req.body;
//     const bookId = req.params.bookId;

//     const book = await bookModel.findOne({ _id: bookId });

//     if (!book) {
//         return next(createHttpError(404, "book not found"))
//     }
//     const _req = req as AuthRequest
//     if (book.author.toString() !== _req.userId) {
//         return next(createHttpError(403, "unauthorized :you cann't update book"))
//     }
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     let completeCoverImage = "";
//     if (files.coverImage) {
//         const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
//         const filename = files.coverImage[0].filename;
//         const filePath = path.resolve(__dirname, '../../public/data/uploads' + filename);
//         completeCoverImage = filename;

//         try {
//             const uploadResult = await cloudinary.uploader.upload(filePath, {
//                 Filename_override: completeCoverImage,
//                 folder: "book-covers",
//             });
//             completeCoverImage = uploadResult.secure_url;
//             await fs.promises.unlink(filePath);
//         } catch (error) {
//             console.log(error)
//             return next(createHttpError(400, "error in upload result",))
//         }


//     }
//     let completeFileName = "";
//     if (files.coverImage) {
//         const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
//         const bookFileName = files.file[0].filename;
//         // Corrected path concatenations

//         const bookFilePath = path.resolve(__dirname, '../../public/data/uploads/' + files.file[0].filename);

//         completeFileName = bookFileName;
//         try {
//             const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
//                 resource_type: "raw",
//                 Filename_override: completeFileName,
//                 folder: "book-covers",
//             }
//             )
//             completeCoverImage = uploadResultPdf.secure_url;
//             await fs.promises.unlink(bookFilePath);
//         } catch (error) {
//             console.log(error)
//             return next(createHttpError(400, "error in uploadResultPdf"))
//         }
//     }

//     const updatedBook = await bookModel.findOneAndUpdate({
//         _id: bookId,
//     },
//         {
//             title: title,
//             genre: genre,
//             coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
//             file: completeFileName ? completeFileName : book.file,
//         },
//         { new: true }


//     );
//     res.json(updatedBook)
// };

// export { createBook, updateBook };


import { NextFunction, Response, Request } from "express";
import path from 'node:path';
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
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        const uploadPromises = [];

        // Upload cover image
        const coverImage = files.coverImage[0];
        const coverImageUpload = cloudinary.uploader.upload(coverImage.path, {
            folder: "book-covers",
            format: coverImage.mimetype.split('/').at(-1),
        });
        uploadPromises.push(coverImageUpload);

        // Upload book file
        const bookFile = files.file[0];
        const bookFileUpload = cloudinary.uploader.upload(bookFile.path, {
            resource_type: 'raw',
            folder: "book-pdfs",
            format: "pdf",
        });
        uploadPromises.push(bookFileUpload);

        // Wait for both uploads to finish
        const [coverUploadResult, bookUploadResult] = await Promise.all(uploadPromises);

        // Create book in the database
        const _req = req as AuthRequest;
        const newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
            coverImage: coverUploadResult.secure_url,
            file: bookUploadResult.secure_url
        });

        // Clean up uploaded files
        await Promise.all([
            fs.promises.unlink(coverImage.path),
            fs.promises.unlink(bookFile.path)
        ]);

        res.status(201).json({ id: newBook._id });
    } catch (error) {
        next(createHttpError(500, "Error while file uploading"));
    }
};

// const updateBook = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { title, genre } = req.body;
//     const bookId = req.params.bookId;

//     try {
//         const book = await bookModel.findOne({ _id: bookId });
//         if (!book) {
//             return next(createHttpError(404, "Book not found"));
//         }

//         const _req = req as AuthRequest;
//         if (book.author.toString() !== _req.userId) {
//             return next(createHttpError(403, "Unauthorized: You can't update this book"));
//         }

//         const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//         const coverImage = files.coverImage ? files.coverImage[0] : null;
//         const bookFile = files.file ? files.file[0] : null;

//         // Upload cover image if exists
//         let completeCoverImage = book.coverImage;
//         if (coverImage) {
//             const coverUploadResult = await cloudinary.uploader.upload(coverImage.path, {
//                 folder: "book-covers",
//                 format: coverImage.mimetype.split('/').at(-1),
//             });
//             completeCoverImage = coverUploadResult.secure_url;
//             await fs.promises.unlink(coverImage.path);
//         }

//         // Upload book file if exists
//         let completeFileName = book.file;
//         if (bookFile) {
//             const bookUploadResult = await cloudinary.uploader.upload(bookFile.path, {
//                 resource_type: 'raw',
//                 folder: "book-pdfs",
//                 format: "pdf",
//             });
//             completeFileName = bookUploadResult.secure_url;
//             await fs.promises.unlink(bookFile.path);
//         }

//         // Update book in the database
//         const updatedBook = await bookModel.findOneAndUpdate(
//             { _id: bookId },
//             { title, genre, coverImage: completeCoverImage, file: completeFileName },
//             { new: true }
//         );

//         res.json(updatedBook);
//     } catch (error) {
//         next(createHttpError(500, "Error while updating book"));
//     }

// };

const updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, genre } = req.body;
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
            { title, genre, coverImage: updatedCoverImage, file: updatedBookFile },
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
        const books = await bookModel.find();
        res.json(books)
    } catch (error) {
        return next(createHttpError(500, "Error in boolList"));
    }

};

const getSinglebook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = req.params.bookId;
    try {
        const SingleBook = await bookModel.find({ _id: bookId });
        if (!SingleBook) {
            return next(createHttpError(404, "Book not found"));
        }
        res.json(SingleBook)
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
        // Handle any errors
        next(createHttpError(500, "Internal server error"));
    }
};



export { createBook, updateBook, bookList, getSinglebook, deleteBook };

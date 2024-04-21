import { NextFunction, Response, Request } from "express";
import path from 'node:path';
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    const { title, genre } = req.body;


    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName)



    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            Filename_override: fileName,
            folder: "book-covers",

            format: coverImageMimeType,
        });
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

        const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            Filename_override: bookFileName,
            folder: "book-pdfs",
            format: "pdf",
        });
        console.log(bookFileUploadResult);
        console.log(uploadResult)
        const newBook = await bookModel.create({
            title,
            genre,
            author: "6624009f0c7fa4342c4db8ce",
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url
        });

        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
        res.status(201).json({ id: newBook._id });

    } catch (error) {

        return next(createHttpError(500, "error while file uploading"))
    }

}
export { createBook };






// import { NextFunction, Response, Request } from "express";
// import path from 'node:path';
// import cloudinary from "../config/cloudinary";
// import createHttpError from "http-errors";
// import bookModel from "./bookModel";
// import fs from "node:fs";

// const createBook = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { title, genre } = req.body;

//     try {
//         // Ensure files are present in the request and coverImage is present
//         if (!req.files || !('coverImage' in req.files) || !('file' in req.files)) {
//             throw createHttpError(400, "Missing files in request");
//         }

//         // Access files object depending on its type
//         const files = Array.isArray(req.files) ? req.files[0] : req.files;

//         // Access coverImage and file properties
//         const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
//         const fileName = files.coverImage[0].filename;
//         const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

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

//         // Save the new book
//         const newBook = await bookModel.create({
//             title,
//             genre,
//             author: "6624009f0c7fa4342c4db8ce",
//             coverImage: uploadResult.secure_url,
//             file: bookFileUploadResult.secure_url
//         });

//         // Cleanup temporary files
//         await fs.promises.unlink(filePath);
//         await fs.promises.unlink(bookFilePath);

//         res.status(201).json({ id: newBook._id });
//     } catch (error) {
//         console.error("Error uploading file:", error);

//         // If an error occurs during file uploading or processing, return a 500 Internal Server Error
//         next(createHttpError(500, "Error while uploading file"));
//     }
// };

// export { createBook };


// import path from "node:path";
// import fs from "node:fs";
// import { Request, Response, NextFunction } from "express";
// import cloudinary from "../config/cloudinary";
// import createHttpError from "http-errors";
// import bookModel from "./bookModel";


// const createBook = async (req: Request, res: Response, next: NextFunction) => {
//     const { title, genre } = req.body;

//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     // 'application/pdf'
//     const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
//     const fileName = files.coverImage[0].filename;
//     const filePath = path.resolve(
//         __dirname,
//         "../../public/data/uploads",
//         fileName
//     );

//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             filename_override: fileName,
//             folder: "book-covers",
//             format: coverImageMimeType,
//         });

//         const bookFileName = files.file[0].filename;
//         const bookFilePath = path.resolve(
//             __dirname,
//             "../../public/data/uploads",
//             bookFileName
//         );

//         const bookFileUploadResult = await cloudinary.uploader.upload(
//             bookFilePath,
//             {
//                 resource_type: "raw",
//                 filename_override: bookFileName,
//                 folder: "book-pdfs",
//                 format: "pdf",
//             }
//         );


//         const newBook = await bookModel.create({
//             title,
//             genre,
//               author: req.userId,
//             coverImage: uploadResult.secure_url,
//             file: bookFileUploadResult.secure_url,
//         });

//         // Delete temp.files
//         // todo: wrap in try catch...
//         await fs.promises.unlink(filePath);
//         await fs.promises.unlink(bookFilePath);

//         res.status(201).json({ id: newBook._id });
//     } catch (err) {
//         console.log(err);
//         return next(createHttpError(500, "Error while uploading the files."));
//     }
// };
// export { createBook };
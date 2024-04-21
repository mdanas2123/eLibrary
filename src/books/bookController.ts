import { NextFunction, Response, Request } from "express";
import path from 'node:path';
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";

const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    console.log("files", req.files)

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
        res.json({});
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "error while file uploading"))
    }

}
export { createBook }; 
import { NextFunction, Response, Request } from "express";

const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    console.log("files", req.files)
    res.json({})
}
export { createBook }; 
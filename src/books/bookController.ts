import { NextFunction, Response, Request } from "express";

const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    res.json({})
}
export default createBook;
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = createHttpError(400, "All feild are required")
        return next(error);
    }
    res.json({ messsage: "user registerd successfully" })
}
export default createUser;
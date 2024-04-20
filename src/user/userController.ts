import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

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
    const user = await userModel.findOne({ email })
    if (user) {
        const error = createHttpError(400, "User already exist")
        return next(error);
    }
    const hashedPasswrd = await bcrypt.hash(password, 10)


    res.json({ messsage: "user registerd successfully" })
}
export { createUser };
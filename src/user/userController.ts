import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import { sign } from "jsonwebtoken";
import { User } from "./userTypes";

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
    try {
        const user = await userModel.findOne({ email })
        if (user) {
            const error = createHttpError(400, "User already exist")
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "error while getting user "));
    }

    const hashedPasswrd = await bcrypt.hash(password, 10)

    let newUser: User;
    try {

        newUser = await userModel.create({
            name,
            email,
            password: hashedPasswrd
        });
    } catch (error) {
        return next(createHttpError(500, "error while creting user"))
    }

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: "7d", algorithm: "HS256" });

    res.json({ accessToken: token });
}
export { createUser };
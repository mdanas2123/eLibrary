import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import { sign } from "jsonwebtoken";

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
    const newUser = await userModel.create({
        name,
        email,
        password: hashedPasswrd
    });


    const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: "7d", algorithm: "HS256" });

    res.json({ accessToken: token });
}
export { createUser };